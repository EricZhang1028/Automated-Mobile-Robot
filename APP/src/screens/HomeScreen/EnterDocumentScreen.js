import React, { Component } from 'react';
import { Container, Label, Input, Form, Item, Thumbnail, Button, Text } from 'native-base';
import { connect } from 'react-redux';
import db from '../../AWS/dynamodb_config';
import awsIot from 'aws-iot-device-sdk';
import MainTabs from '../MainTabs/MainTabs';

class EnterDocumentScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _isMounted: false
        }
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

    sendRequestHandler = () => {
        this.device.publish('topic_1', this.props.currentUser.name.toString().trim() + "::to::" + this.props.targetUser.user_name.toString().trim());
        this.device.subscribe('topic_2');
        this.device
            .on('message', function (topic, payload) {
                if (!this._isMounted && payload.toString() === "::to::" + this.props.currentUser.name.toString().trim() + "::ok") {
                    const recordparams = {
                        TableName: "Record",
                        Item: {
                            "user_id": this.props.currentUser.email, // Equals 'requester_id'
                            "requester_name": this.props.currentUser.name,
                            "receiver_id": this.props.targetUser.user_id,
                            "receiver_name": this.props.targetUser.user_name,
                            "request_time": new Date().toLocaleString(),
                            "requester_office": this.props.currentUser.office,
                            "receiver_office": this.props.targetUser.office,
                            "finished": 0
                        }
                    }
                    db.put(recordparams, (err, data) => {
                        if (err) {
                            console.log("err msgs: ", err)
                        }
                        else {
                            console.log(data != null ? "Send request Succeess!" : "Send request fail...")
                        }
                    })
                    this.goToReviewSendingStateHandler();
                    this.setState({ _isMounted: true });
                }
                else if (payload.toString() === "::to::" + this.props.currentUser.name.toString().trim() + "::reject") {
                    this.backToHomeHandler();
                }
            }.bind(this));
    }

    componentWillUnmount() {
        //this.isMounted = false;
    }

    goToReviewSendingStateHandler = () => {
        this.props.navigator.resetTo({
            screen: "IM3514_Project.ReviewSendingStateScreen",
            title: "寄送狀態",
            passProps: {
                targetName: this.props.targetUser.user_name.toString().trim(),
                targetOffice: this.props.targetUser.office.office_id.toString().trim()
            }
        });
    }

    backToHomeHandler = () => {
        MainTabs();
        // this.props.navigator.resetTo({
        //     screen: "IM3514_Project.HomeScreen",
        //     title: "首頁",
        //     drawer: {
        //         left: {
        //             screen: "IM3514_Project.SideDrawer",
        //         }
        //     }
        // });
        // this.props.navigator.popToRoot({
        //     animated: true, // does the popToRoot have transition animation or does it happen immediately (optional)
        //     animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the popToRoot have different transition animation (optional)

        // });
    }

    render() {
        personalImageDict = {
            'TonyChen': require("../../img/Tony.png"),
            'Eric': require("../../img/Eric.png"),
            'Ruby': require("../../img/Ruby.png"),
            'Cow': require("../../img/Harry.png"),
            'Jason': require("../../img/Jason.png")
        }
        return (
            <Container style={{ width: "85%", alignSelf: "center" }}>
                <Form style={{ marginTop: 10 }}>
                    <Item style={{ alignSelf: "center", marginTop: 10, marginBottom: 10 }} >
                        <Thumbnail large source={personalImageDict[this.props.targetUser.user_name]} />
                    </Item>
                    <Item>
                        <Label>收件人：</Label>
                        <Input editable={false}>{this.props.targetUser.user_name}</Input>
                    </Item>
                    <Item>
                        <Label>辦公室：</Label>
                        <Input value={this.props.targetUser.office.office_id} editable={false}></Input>
                    </Item>
                    <Item>
                        <Label>文件名稱：</Label>
                        <Input></Input>
                    </Item>
                    <Button block style={{ alignSelf: "center", marginTop: 10 }}
                        onPress={this.sendRequestHandler}>
                        <Text>確認送出</Text>
                    </Button>
                </Form>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {
        currentUser: state.auth.currentUser
    };
};

export default connect(mapStateToProps)(EnterDocumentScreen);