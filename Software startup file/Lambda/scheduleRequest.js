var AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-northeast-1' });
var db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

exports.scheduleHandler = async(event, context, callback) => {
    // TODO implement
    var cancelledRequst = [];
    let [queryResult, pollingResult] = await Promise.all([querySchedule(), pollingSQS()]);
    if (pollingResult) {
        for (var i = 0; i < pollingResult.Messages.length; i++) {
            var cancelled = {
                "user_id": pollingResult.Messages[i].MessageAttributes.user_id.StringValue,
                "request_time": pollingResult.Messages[i].MessageAttributes.request_time.StringValue
            }
            cancelledRequst.push(cancelled);
        }
    }

    var result = {
        "scheduleRequest": queryResult,
        "cancelledRequest": cancelledRequst
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(result)
    };
    console.log(response)
    callback(null, response);

    /* FilterExpression: "attribute_not_exists(cancelled)" */
};

var querySchedule = () => {
    console.log('enter 1');
    return new Promise((resolve, reject) => {
        var params = {
            TableName: "Record",
            IndexName: "finished-request_time-index",
            ExpressionAttributeNames: { "#finished": "finished" },
            KeyConditionExpression: "#finished = :v1",
            ExpressionAttributeValues: { ":v1": 0 }
        };
        db.query(params, (err, data) => {
            resolve(data);
        });
    });
}

var pollingSQS = () => {
    console.log('enter 2')
    return new Promise((resolve, reject) => {
        /* 請將此處的queueURL替換為自己的 */
        var queueURL = 'https://sqs.ap-northeast-1.amazonaws.com/623108787235/CancelledRequestQueue';
        var params = {
            AttributeNames: ["SentTimestamp"],
            MaxNumberOfMessages: 10,
            MessageAttributeNames: ["All"],
            QueueUrl: queueURL,
            VisibilityTimeout: 20,
            WaitTimeSeconds: 0
        };
        sqs.receiveMessage(params, (err, data) => {
            if (err) {
                console.log("Receive Error", err);
            }
            else if (data.Messages) {
                resolve(data);
                for (var i = 0; i < data.Messages.length; i++) {
                    var deleteParams = {
                        QueueUrl: queueURL,
                        ReceiptHandle: data.Messages[i].ReceiptHandle
                    };
                    sqs.deleteMessage(deleteParams, function(err, data) {
                        if (err) {
                            console.log("Delete Error", err);
                        }
                        else {
                            console.log("Message Deleted", data);
                        }
                    });
                }

            }
            else {
                resolve();
            }
        });
    });
}
