import React, { Component } from "react";
import { View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Container, Content, Card, CardItem, Text, Body, Button, Right, Left } from "native-base";
import { connect } from "react-redux";
import db from '../../AWS/dynamodb_config';
import awsIot from 'aws-iot-device-sdk';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    rootNavigator = this.props.navigator;
    this.state = {
      requestedHistory: [],
      receivedHistory: [],
      senderName: '',
      _isMounted: false
    }
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    this.loadUseHistory();
    this.device = awsIot.device({
      protocol: "wss",
      accessKeyId: "AKIAIXEYLVHUU7TOKG7A",
      secretKey: "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",
      host: "a1l8hojgkwiu2w-ats.iot.ap-northeast-1.amazonaws.com"
    });
    console.ignoredYellowBox = [
      'Setting a timer',
      'Warning: Each',
      'Warning: Failed'
    ];
    console.disableYellowBox = true;
  }

  componentDidMount() {
    this.device
      .on('connect', function () {
        console.log('connect');
        //subscribe here
        this.device.subscribe('topic_1');
      }.bind(this));

    this.device
      .on('message', function (topic, payload) {
        console.log('message', topic, payload.toString());
        console.log(payload.toString())
        if (!this._isMounted && payload.toString().includes("::to::" + this.props.currentUser.name.toString().trim())) {
          //do any thing if get right topic or payload
          console.log("success");
          var temp = payload.toString();
          this.state.senderName = temp.substr(0, temp.indexOf("::"));
          this.popUpAlert();
          this.setState({_isMounted: true});
          this.componentWillUnmount();
        }
      }.bind(this));  
    //publish once
    // this.device.publish('topic_2', "hello");
    // //publish loop
    // timeout = setInterval(function () {
    //   this.device.publish('topic_2', "hello loop");
    // }.bind(this), 25);//interval time
  }

  onNavigatorEvent = event => {
    if (event.type === "NavBarButtonPress" && event.id === "sideDrawerToggle") {
      this.props.navigator.toggleDrawer({
        side: "left",
        animated: true,
      });
    }
  }

  componentWillUnmount() {
    this.device.unsubscribe('topic_1');
  }

  loadUseHistory = () => {
    var requestedHistoryParams = {
      TableName: "Record",
      KeyConditionExpression: "#user_id = :user_id",
      ExpressionAttributeNames: { "#user_id": "user_id" },
      ExpressionAttributeValues: { ":user_id": this.props.currentUser.email },
      Limit: 3,
      ScanIndexForward: false
    }
    db.query(requestedHistoryParams, (err, data) => {
      if (err) {
        console.log("Query requested history error : ", err);
      }
      else {
        console.log("Query requested history success : ", data);
        this.setState({
          requestedHistory: data.Items.map((record, index) => {
            return {
              "key": index.toString(),
              "request_time": record.request_time.split(' ').join('\n'),
              "receiver_name": record.receiver_name
            };
          })
        })
      }
    });

    var receivedHistoryParams = {
      TableName: "Record",
      IndexName: "receiver_id-request_time-index",
      KeyConditionExpression: "#receiver_id = :receiver_id",
      ExpressionAttributeNames: { "#receiver_id": "receiver_id" },
      ExpressionAttributeValues: { ":receiver_id": this.props.currentUser.email },
      Limit: 3,
      ScanIndexForward: false
    }
    db.query(receivedHistoryParams, (err, data) => {
      if (err) {
        console.log("Query received history error : ", err)
      }
      else {
        console.log("Query received history success : ", data);
        this.setState({
          receivedHistory: data.Items.map((record, index) => {
            return {
              "key": index.toString(),
              "request_time": record.request_time.split(' ').join('\n'),
              "requester_name": record.requester_name
            };
          })
        });
      }
    });
  }

  startRequestHandler = () => {
    this.props.navigator.push({
      screen: "IM3514_Project.ChooseTargetScreen",
      title: "遞送對象"
    });
  }

  popUpAlert = () => {
    Alert.alert(
      '收件通知',
      this.props.currentUser.name.toString() + '您好，' + this.state.senderName.toString() + '有一文件寄送給您。',
      [
        {
          text: '接受', onPress: () => {
            this.device.publish("topic_2", "::to::" + this.state.senderName.toString().trim() + "::ok");
            console.log('Ask me later pressed');
          }
        },
        {
          text: '拒絕', onPress: () => {
            this.device.publish("topic_2", "::to::" + this.state.senderName.toString().trim() + "::reject");
            console.log('Cancel Pressed');
          }, style: 'cancel'
        },
        //{ text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false }
    )
  }

  goToSendHistoryHandler = () => {
    console.log("goToSendHistoryHandler");
    this.props.navigator.push({
      screen: "IM3514_Project.SendHistoryScreen",
      title: "遞送請求記錄"
    });
  }

  goToReceiveHistoryHandler = () => {
    this.props.navigator.push({
      screen: "IM3514_Project.ReceiveHistoryScreen",
      title: "收件記錄"
    });
  }

  render() {
    return (
      <Container>
        <Content padder>
          <Button rounded danger
            style={{ alignSelf: "center", marginTop: 20, marginBottom: 20 }}
            onPress={this.startRequestHandler}>
            <Text>請求遞送文件</Text>
          </Button>
          <Card>
            <CardItem header style={{ alignSelf: "center" }} bordered>
              <Text>您最近的遞送請求記錄</Text>
            </CardItem>
            <FlatList
              data={this.state.requestedHistory}
              renderItem={info => (
                <CardItem>
                  <Left>
                    <Text>{info.item.request_time}</Text>
                  </Left>
                  <Body style={{ alignSelf: "center" }}>
                    <Text note>送出</Text>
                  </Body>
                  <Right>
                    <Text>{info.item.receiver_name}</Text>
                  </Right>
                </CardItem>
              )}
            />

            {/* <CardItem>
              <Left>
                <Text>2018-09-16 上午10:00</Text>
              </Left>
              <Body style={{ alignSelf: "center" }}>
                <Text note>送出</Text>
              </Body>
              <Right>
                <Text>李大龍</Text>
              </Right>
            </CardItem>
            <CardItem>
              <Left>
                <Text>2018-09-15 下午03:30</Text>
              </Left>
              <Body style={{ alignSelf: "center" }}>
                <Text note>送出</Text>
              </Body>
              <Right>
                <Text>范大強</Text>
              </Right>
            </CardItem>
            <CardItem>
              <Left>
                <Text>2018-09-15 上午09:30</Text>
              </Left>
              <Body style={{ alignSelf: "center" }}>
                <Text note>送出</Text>
              </Body>
              <Right>
                <Text>陳小花</Text>
              </Right>
            </CardItem> */}
            <CardItem footer bordered style={{ alignSelf: "center" }}>
              <TouchableOpacity onPress={this.goToSendHistoryHandler}>
                <View>
                  <Text>查看全部</Text>
                </View>
              </TouchableOpacity>
            </CardItem>
          </Card>

          <Card>
            <CardItem header style={{ alignSelf: "center" }} bordered>
              <Text>您最近的收件記錄</Text>
            </CardItem>
            <FlatList
              data={this.state.receivedHistory}
              renderItem={info => (
                <CardItem>
                  <Left>
                    <Text>{info.item.request_time}</Text>
                  </Left>
                  <Body style={{ alignSelf: "center" }}>
                    <Text note>收到</Text>
                  </Body>
                  <Right>
                    <Text>{info.item.requester_name}</Text>
                  </Right>
                </CardItem>
              )}
            />
            {/* <CardItem>
              <Left>
                <Text>2018-09-18 下午04:00</Text>
              </Left>
              <Body style={{ alignSelf: "center" }}>
                <Text note>收到</Text>
              </Body>
              <Right>
                <Text>林小華</Text>
              </Right>
            </CardItem>
            <CardItem>
              <Left>
                <Text>2018-09-16 下午03:12</Text>
              </Left>
              <Body style={{ alignSelf: "center" }}>
                <Text note>收到</Text>
              </Body>
              <Right>
                <Text>黃大明</Text>
              </Right>
            </CardItem>
            <CardItem>
              <Left>
                <Text>2018-09-15 上午11:57</Text>
              </Left>
              <Body style={{ alignSelf: "center" }}>
                <Text note>收到</Text>
              </Body>
              <Right>
                <Text>陳小花</Text>
              </Right>
            </CardItem> */}
            <CardItem footer bordered style={{ alignSelf: "center" }}>
              <TouchableOpacity onPress={this.goToReceiveHistoryHandler}>
                <View>
                  <Text>查看全部</Text>
                </View>
              </TouchableOpacity>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.auth.currentUser
  };
};

export default connect(mapStateToProps)(HomeScreen);