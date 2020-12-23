const fs = require('fs')
const _ = require('lodash');
const ROSLIB = require('roslib');
const request = require('request');
const awsiot = require('aws-iot-device-sdk');
var player = require('play-sound')(opts = {})
const internetAvailable = require('internet-available');
const rosip = '127.0.0.1';


/* ------------------------------ AWS－IOT連線-起點 ------------------------------ */
var device = awsiot.device({
	protocol: 'wss',
	filename: './aws_credentials',
	host: 'a1l8hojkwiu2w-ats.iot.ap-northeast-1.amazonaws.com' // 請替換為自己的host
});

device
	.on('connect', function() {
		console.log('AWS IoT connect.');
	});
device
	.on('close', function() {
		console.log('AWS IoT close.');
	});
device
	.on('reconnect', function() {
		console.log('AWS IoT reconnect.');
	});
device
	.on('offline', function() {
		console.log('AWS IoT offline.');
	});
device
	.on('error', function(error) {
		console.log('AWS IoT error.', error);
	});
device.publish('topic_1', JSON.stringify('hello me'));
/* ------------------------------ AWS－IOT連線-終點 ------------------------------ */


var currentGoal = null, 	// 目前的導航物件
	currentRequest = null, 	// 目前的遞送請求(in local result)
	info = null,			// 目前的遞送請求(in local schedule)
	robotState = true; 		// 機器人狀態：{False->執行中, True->閒置中},
var localResult = [], 		// 本地端所有遞送結果
	localSchedule = []; 	// 本地端待處理之請求
var requestInterval, timeInterval = 8000;
var basePose = [0.432707939429, 0.407066388202,  0.998185513431, 0.0602136261714]; // [x, y, z, w]
var musicProcess = null;


/* ------------------------------ ROS設定 ------------------------------ */
var ros = new ROSLIB.Ros();
ros.connect('ws://' + rosip + ':9090');

// 導航
var actionClient = new ROSLIB.ActionClient({
	ros: ros,
	actionName: "move_base_msgs/MoveBaseAction",
	serverName: "/move_base"
});

// 導航結果
var resultTopic = new ROSLIB.Topic({
	ros: ros,
	name: '/move_base/result',
	messageType: 'move_base_msgs/MoveBaseActionResult'
}); 

// 初始位置
var initialposeTopic = new ROSLIB.Topic({
	ros: ros,
	name: '/initialpose',
	messageType: 'geometry_msgs/PoseWithCovarianceStamped'
});

var initialMsg = new ROSLIB.Message({
	header: {
		seq: 16,
		stamp: {
			secs: 1545044944,
			nsecs: 692258899
		},
		frame_id: "map"
	},
	pose: {
		pose: {
			position: {
				x: basePose[0],
				y: basePose[1],
				z: 0.0
			},
			orientation: {
				x: 0.0,
				y: 0.0,
				z: basePose[2],
				w: basePose[3]
			}
		},
		covariance: [0.25, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.25, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.06853891945200942]
	}
});
/* ------------------------------ ROS設定 ------------------------------ */


/* 調用各函式 */
var controller = () => {
	if (localSchedule.length > 0) {
		robotState = false;
		info = localSchedule.shift();
		setCurrentRequest(info.user_id, info.request_time);
		startNavigation();
	}
	else {
		console.log('機器人返回基地。');
		robotState = true;
		info = {
			pose: basePose,
			state: "toBase"
		}
		startNavigation();
	}
}

var sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/* 取得新Schedule */
var getScheduleFromCloud = () => {
	//console.log("---------------------- Get new schedule -------------------------");

	return new Promise((resolve, reject) => {
		internetAvailable()
			.then(() => {
				//console.log('Connect to Internet success.');
				request({
					url: "https://d7awi3w0v.execute-api.ap-northeast-1.amazonaws.com/im3514/getschedule", // 請替換為自己的api url
					json: true
				}, function(error, response, body) {
					if (!error && response.statusCode === 200) {
						var scheduleRequest = JSON.parse(body.body).scheduleRequest.Items;
						var cancelledRequest = JSON.parse(body.body).cancelledRequest;
						//console.log('New schedule : ', scheduleRequest.length);
						//console.log('Cancelled schedule : ', cancelledRequest.length);
						updateLocalSchedule(scheduleRequest);
						updateLocalCancelledRequest(cancelledRequest);
					} else {
						//console.log('Get new schedule response unknown error.');
					}
					resolve();
				});
			})
			.catch(() => {
				console.log('Get new schedule failed due to network disconnetion.');
				resolve();
			})
	});

}

/* 與本地端的Request Queue比對並更新 */
var updateLocalSchedule = (schedule) => {
	var i, tempArr = [];
	for (i = 0; i < schedule.length; i++) {
		var isFind = localSchedule.some((item, index) => {
			return (item.user_id == schedule[i].user_id) && (item.request_time == schedule[i].request_time)
		}) || localResult.some((item, index) => {
			return (item.user_id == schedule[i].user_id) && (item.request_time == schedule[i].request_time)
		});

		if (!isFind) {
			var toRequester = {
				"user_id": schedule[i].user_id,
				"pose": [
					parseFloat(schedule[i].requester_office.pose.position.x.values[0]),
					parseFloat(schedule[i].requester_office.pose.position.y.values[0]),
					parseFloat(schedule[i].requester_office.pose.orientation.z),
					parseFloat(schedule[i].requester_office.pose.orientation.w)
				],
				"request_time": schedule[i].request_time,
				"state": "toRequester"
			};
			var toReceiver = {
				"user_id": schedule[i].user_id,
				"pose": [
					parseFloat(schedule[i].receiver_office.pose.position.x.values[0]),
					parseFloat(schedule[i].receiver_office.pose.position.y.values[0]),
					parseFloat(schedule[i].receiver_office.pose.orientation.z),
					parseFloat(schedule[i].receiver_office.pose.orientation.w)
				],
				"request_time": schedule[i].request_time,
				"state": "toReceiver"
			};
			localSchedule.push(toRequester, toReceiver);
			localResult.push(schedule[i]);
		}
	}
}

/* 更新取消的Reqeust */
var updateLocalCancelledRequest = (cancelledRequest) => {
	var i;
	for (i = 0; i < cancelledRequest.length; i++) {
		_.remove(localSchedule, (item) => {
			return (item.user_id === cancelledRequest[i].user_id) && (item.request_time === cancelledRequest[i].request_time);
		});
		//console.log('localResult_arr : ', localResult);
		//console.log('current cancelled request : ', cancelledRequest[i]);
		var localResultObj = localResult.find((item, index, array) => {
			return (item.user_id === cancelledRequest[i].user_id) && (item.request_time === cancelledRequest[i].request_time);
		});
		if (localResultObj) {
			console.log(localResultObj);
			localResultObj.cancelled = {};
			localResultObj.cancelled.cancel_time = new Date().toLocaleString();
			localResultObj.cancelled.cancel_state = true;
			localResultObj.finished = 1;
			//localResultObj.cancelled.cance_reason = cancelledRequest[i].cancel_reason;
		}
		if (currentRequest.user_id === cancelledRequest[i].user_id && currentRequest.request_time === cancelledRequest[i].request_time) {
			info.state = 'requestCancelled';
			currentGoal.cancel();
		}
	}
}

/* 寫回資料庫 */
var writeBackToDynamoDB = () => {
	//console.log("---------------------- Write to DynamoDB ----------------------");

	internetAvailable().then(() => {
			//console.log("Length of local result (Before) --> ", localResult.length);
			request.post(
				'https://d7awi3w0v.execute-api.ap-northeast-1.amazonaws.com/im3514/updaterecord', {. // 請替換為自己的api url
					json: {
						"record": localResult
					}
				},
				function(error, response, body) {
					if (!error && response.statusCode == 200) {
						localResult = localResult.filter((item, index, array) => {
							return item.finished == 0;
						});
						console.log('GET3---------', new Date().toLocaleString());
					} else {
						console.log('DynamoDB response unknown error.')
					}

				}
			);
		})
		.catch(() => {
			console.log('Write to DynamoDB fail due to network disconnetion.')
		});

}

/* 清除Global Map */
var clearCostMap = () => {
	var clearService = new ROSLIB.Service({
		ros: ros,
		name: '/move_base/clear_costmaps',
		serviceType: 'std_srvs/Empty'
	});
	var clearRequest = new ROSLIB.ServiceRequest({});
	clearService.callService(clearRequest, (result) => {
		console.log(clearService.name + ' : success.');
	})
}

/* 導航 */
var startNavigation = async() => {
	console.log("開始導航！");
	clearCostMap();
	playMusic('jingleBells_all.mp3');
	currentGoal = new ROSLIB.Goal({
		actionClient: actionClient,
		goalMessage: {
			target_pose: {
				header: {
					frame_id: '/map'
				},
				pose: {
					position: {   
						x: info.pose[0],
						y: info.pose[1],
						z: 0.0
					},
					 orientation:  {  
						x: 0.0,
						y: 0.0,
						z: info.pose[3],
						w: info.pose[4]
					}
				}
			}
		}
	});

	// 開始導航
	currentGoal.send();

	// 取消導航
	var cancelTopic = new ROSLIB.Topic({
		ros: ros,
		name: 'move_base/cancel',
		messageType: 'actionlib_msgs/GoalID'
	});
	cancelTopic.subscribe((message) => {
		if (message != "") {
			resolve('Navigation Cancelled.');
		}
	});

}

/* 抵達寄件人 */
var arrivedRequester = async(info) => {
	currentRequest.arrive_to_requester_time = new Date().toLocaleString();
	console.log("**************************************************");
	console.log("I arrived requester office!");
	console.log("**************************************************");

	/* 臉部辨識Topic */
	var faceRecognitionTopic1 = new ROSLIB.Topic({
		ros: ros,
		name: '/face_recognition/detected_faces',
		messageType: 'face_recognition_msgs/DetectedFaces'
	});
	//await sleep(6000); //wait for six second
	await playMusic('arrived.mp3');
	await sleep(5000);

	/* ------------- 寄件流程 ------------- */
	var requesterAction = () => {
		return new Promise(async(resolve, reject) => {
			// 發布抵達通知						
			// device.publish('topic_arrived', JSON.stringify({
			// 	'user_id': currentRequest.user_id,
			// 	'state': 'request'
			// }));

			// 抵達音樂
			await playMusic('startRecognition.mp3');

			// 50秒內無辨識成功 --> 寄件人未寄件，取消該次請求
			var waitTime = setTimeout(async() => {
				currentRequest.robot_received_time = false; // 紀錄機器人未取件
				currentRequest.finished = 1; // 記錄該筆任務已完成
				localSchedule.shift(); // 移除遞送到Receiver的排程
				faceRecognitionTopic1.unsubscribe(); // 取消訂閱臉部辨識
				console.log('50秒等待時間已到，寄件人未寄件。');
				await playMusic('noRequester.mp3');  // 無人寄件音樂
				resolve();
			}, 22000);

			// 訂閱臉部辨識
			console.log('----- 啟動寄件人人臉辨識 -----');
			faceRecognitionTopic1.subscribe(async(faceMsg) => {
				// 臉部辨識為本人
				if (faceMsg.names[0] == currentRequest.user_id) {
					console.log('辨識成功: ', faceMsg.names);
					faceRecognitionTopic1.unsubscribe(); // 取消訂閱臉部辨識
					currentRequest.robot_received_time = new Date().toLocaleString() // 紀錄機器人取件時間
					clearTimeout(waitTime); // 取消40秒之等待時間
					console.log('寄件人臉部辨識成功，即將前往收件者辦公室。')
					await playMusic('requesterRecogFinish.mp3');
					await sleep(10000);
					await playMusic('go.mp3');
					
					resolve();
				}
			});
		});
	}
	await requesterAction();
	controller();
	/* ------------- 寄件流程 ------------- */
}

/* 抵達收件人 */
var arrivedReceiver = async(info) => {
	currentRequest.arrive_to_receiver_time = new Date().toLocaleString();
	console.log("**************************************************");
	console.log("I arrived receiver office!");
	console.log("**************************************************");
	//await sleep(10000); //wait for ten seconds

	/* 臉部辨識Topic */
	var faceRecognitionTopic2 = new ROSLIB.Topic({
		ros: ros,
		name: '/face_recognition/detected_faces',
		messageType: 'face_recognition_msgs/DetectedFaces'
	});
	await playMusic('arrived.mp3');
	await sleep(3000);

	/* ------------- 收件流程 ------------- */
	var receiverAction = () => {
		return new Promise(async(resolve, reject) => {
			// 發布抵達通知
			// device.publish('topic_arrived', JSON.stringify({
			// 	'user_id': currentRequest.receiver_id,
			// 	'state': 'receive'
			// }));

			// 啟動臉部辨識
			await playMusic('startRecognition.mp3');

			// 40秒內無辨識成功 --> 紀錄收件人未收件
			var waitReceiveTime = setTimeout(async() => {
				faceRecognitionTopic2.unsubscribe(); // 取消訂閱臉部辨識
				currentRequest.robot_requested_time = false; // 紀錄收件者未取件
				currentRequest.finished = 1; // 紀錄該筆資料已完成
				console.log('50秒等待時間已到，收件人未取件。');
				await playMusic('noReceiver.mp3');
				resolve();
			}, 22000);

			// 訂閱「臉部辨識結果」
			console.log('----- 啟動收件人人臉辨識 -----');
			faceRecognitionTopic2.subscribe(async(faceMsg) => {
				// 臉部辨識為本人
				if (faceMsg.names[0] == currentRequest.receiver_id) {
					console.log('辨識成功: ', faceMsg.names);
					faceRecognitionTopic2.unsubscribe(); // 取消訂閱臉部辨識
					clearTimeout(waitReceiveTime); // 取消120秒之等待時間
					currentRequest.robot_requested_time = new Date().toLocaleString(); // 紀錄收件時間
					currentRequest.finished = 1; // 紀錄該筆資料已完成
					console.log('收件人臉部辨識成功，機器將等待8秒供收件人取件。')
					await playMusic('receiverRecogFinish.mp3');
					// 等待20秒供收件人取件
					var waitTime = setTimeout(async() => {
						await playMusic('go.mp3');
						resolve();
					}, 20000);
				}
			})
		});
	}
	await receiverAction();
	controller();
	/* ------------- 收件流程 ------------- */

}
/* 取得目前執行的Request from localResult */
var setCurrentRequest = (user_id, request_time) => {
	currentRequest = localResult.find((item, index, array) => {
		return ((item.user_id === user_id) && (item.request_time === request_time));
	});
	if (currentRequest == null) {
		currentRequest = {
			"user_id": user_id,
			"request_time": request_time
		}
		localResult.push(currentRequest);
	}
}

/* ROS連接成功，初始化設定 */
var initialState = () => {
	var temp2 = () => {
		if(musicProcess != null) musicProcess.kill();
		controller();
	}

	// 定期取得新Schedule並寫回資料庫
	requestInterval = setInterval(async () => {
		console.log('GET1---', new Date().toLocaleString());
		await getScheduleFromCloud();
		console.log('GET2------', new Date().toLocaleString());
		writeBackToDynamoDB();

		(robotState && localSchedule.length > 0) ? temp2() : null;
	}, timeInterval);
	initialposeTopic.publish(initialMsg); // 設定初始位置
}

/* 下載當前影像 */
var downloadCurrentImage = () => {
	var fs = require('fs'),
		request = require('request');

	var download = function(uri, filename, callback) {
		request.head(uri, function(err, res, body) {
			request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
		});
	};

	var newFileName = 'DeadEnd_' + new Date().getTime() + '.png';
	download('http://' + rosip + ':8080/snapshot?topic=/usb_cam/image_raw', newFileName, function() {
		console.log('Image Download Done.');
	});
}

/* 播放音樂 */
var playMusic = (musicFile) => {
	// $ mplayer foo.mp3
	return new Promise((resolve, reject) => {
		musicProcess = player.play('music/' + musicFile, function(err) {
			//if (err) throw err
			resolve();
		})
		
	});
}

/* 導航結束（到達目的地 or 取消導航 or 死路) */
device.subscribe('topic_4');
device.on('message', (topic, payload) => {
	if (topic == 'topic_4') {
		console.log(payload);
		startNavigation(); // 狀況排除，重新導航
	}
});
resultTopic.subscribe((resultMsg) => {
	var text = resultMsg.status.text.trim();
	if(!text.includes('canceled')) musicProcess.kill();
	
	if (text.includes('Failed')) { 	// 發生死路
		console.log('Error : Navigation Dead End. Please help me. QQ');
		device.publish('topic_3', "Help Me!!!! QQ"); 	// 發布死路Topic至AWS IoT	
		downloadCurrentImage();	
	} else if (text.includes('reached')) { // 抵達目標
		currentGoal = null;
		if (info.state === 'toRequester') {
			arrivedRequester(info);
		} else if (info.state === 'toReceiver') {
			arrivedReceiver(info);
		} else if (info.state === 'toBase') {
			console.log('機器人已抵達基地。');
		}
	} else if (text.includes('canceled')) { // 請求取消
		console.log('Warning : Navigation Goal was canceled.');
	}
});

/* -------------------------- ROS連接狀態-起點 -------------------------- */
ros.on('error', function(error) {
	console.log("ROS fail. Error : ", error);
});

ros.on('connection', function() {
	console.log('ROS connect.');
	initialState();
});

ros.on('close', function() {
	console.log('ROS close');
});
/* -------------------------- ROS連接狀態-終點 -------------------------- */