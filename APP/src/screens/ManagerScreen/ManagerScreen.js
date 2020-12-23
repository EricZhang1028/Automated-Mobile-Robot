import React, { Component } from 'react';
import { Container, Content, Text, Button, Item, Thumbnail } from 'native-base';
import { StyleSheet, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import awsIot from 'aws-iot-device-sdk';

export default class ManagerScreen extends Component {
    constructor(props) {
        super(props);
        Promise.all([
            Icon.getImageSource("ios-menu", 30, color = "blue"), // result 0
        ]).then(result => {
            this.props.navigator.setButtons({
                leftButtons: [
                    {
                        title: '登出',
                        icon: result[0],
                        id: 'sideDrawerToggle',
                    }
                ],
                animated: true
            });
        });
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
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
          this.device.subscribe('topic_3');
        }.bind(this));
  
      this.device
        .on('message', function (topic, payload) {
          console.log('message', topic, payload.toString());
          console.log(payload.toString())
          if (payload.toString() !== '') {
            //do any thing if get right topic or payload
            console.log("success");
            var temp = payload.toString();
            this.popUpAlert(temp);
          }
        }.bind(this));
    }

    componentWillUnmount() {
        
    }

    popUpAlert = (msg) => {
        Alert.alert(
          '機器人狀況回報',
          msg,
          [
            {
              text: '已解決', onPress: () => {
                this.device.publish("topic_4", "resolved::ok");
                console.log('Ask me later pressed');
              }
            },
            {
              text: '關閉', onPress: () => {
                //this.device.publish("topic_2", "::to::" + this.state.senderName.toString().trim() + "::reject");
                console.log('Cancel Pressed');
              }, style: 'cancel'
            },
            //{ text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: true }
        )
      }

    onNavigatorEvent = event => {
        if (event.type === "NavBarButtonPress" && event.id === "sideDrawerToggle") {
            this.props.navigator.toggleDrawer({
                side: "left",
            });
        }
    }

    goToOfficeListHandler = () => {
        this.props.navigator.push({
            screen: "IM3514_Project.OfficeList",
            title: "辦公室管理"
        });
    }

    goToRobotHistoryHandler = () => {
        this.props.navigator.push({
            screen: "IM3514_Project.RobotHistory",
            title: "機器人使用紀錄"
        });
    }

    goToRobotStateHandler = () => {
        this.props.navigator.push({
            screen: "IM3514_Project.RobotState",
            title: "機器人狀態"
        });
    }

    goToUserListHandler = () => {
        this.props.navigator.push({
            screen: "IM3514_Project.UserList",
            title: "使用者清單"
        });
    }

    render() {
        return (
            <Container style={styles.container}>
                <Image
                    style={{ width: 250, height: 150, alignSelf: "center", marginBottom: 30 }}
                    source={require('../../img/turtlebot.jpg')}
                />
                <Button
                    rounded
                    info
                    style={styles.buttonStyle}
                    onPress={this.goToOfficeListHandler}
                >
                    <Text>辦公室名單管理</Text>
                </Button>

                <Button
                    rounded
                    info
                    style={styles.buttonStyle}
                    onPress={this.goToRobotHistoryHandler}
                >
                    <Text>機器人使用紀錄</Text>
                </Button>

                <Button
                    rounded
                    info
                    style={styles.buttonStyle}
                    onPress={this.goToRobotStateHandler}
                >
                    <Text>機器人狀態</Text>
                </Button>

                <Button
                    rounded
                    info
                    style={styles.buttonStyle}
                    onPress={this.goToUserListHandler}
                >
                    <Text>使用者清單</Text>
                </Button>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonStyle: {
        marginBottom: 30,
        alignSelf: 'center'
    }
});