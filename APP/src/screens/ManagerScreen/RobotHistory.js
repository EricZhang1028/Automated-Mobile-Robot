import React, { Component } from 'react';
import { Container, List, ListItem, Left, Body, Right, Text } from 'native-base';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import db from '../../AWS/dynamodb_config';

class RobotHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            receivedHistory: []
        };
        this.loadReceivedHistory();
    }

    loadReceivedHistory = () => {
        var receivedHistoryParams = {
            TableName: "Record",
            // IndexName: "receiver_id-request_time-index",
            // KeyConditionExpression: "#receiver_id = :receiver_id",
            // ExpressionAttributeNames: { "#receiver_id": "receiver_id" },
            // ExpressionAttributeValues: { ":receiver_id": this.props.currentUser.email },
            // ScanIndexForward: false
        }
        db.scan(receivedHistoryParams, (err, data) => {
            if (err) {
                console.log("Query received history error : ", err)
            }
            else {
                console.log("Query received history success : ", data);
                this.setState({
                    receivedHistory: data.Items.map((record, index) => {
                        return {
                            "key": index.toString(),
                            "request_time_day": record.request_time.split(' ')[0],
                            "request_time_time": record.request_time.split(' ')[1],
                            "requester_name": record.requester_name,
                            "receiver_name": record.receiver_name
                        };
                    })
                });
            }
        });
    }

    render() {
        return (
            <Container>
                <List>
                    <FlatList
                        data={this.state.receivedHistory}
                        renderItem={info => (
                            <ListItem>
                                {/* <Left> */}
                                <Text>{info.item.request_time_day} </Text>
                                <Text>{info.item.request_time_time} </Text>
                                {/* </Left> */}
                                <Text>{info.item.requester_name}</Text>
                                {/* <Body style={{ alignSelf: "center", paddingLeft: 50 }}> */}
                                    <Text note>送出給</Text>
                                {/* </Body> */}
                                <Text>{info.item.receiver_name}</Text>
                            </ListItem>
                        )}
                    />
                    {/* <ListItem>
                        <Left>
                            <Text>2018-09-16 </Text>
                            <Text>下午03:12</Text>
                        </Left>
                        <Body style={{ alignSelf: "center", paddingLeft: 50 }}>
                            <Text note>收到</Text>
                        </Body>
                        <Text>黃大明</Text>
                    </ListItem>
                    <ListItem>
                        <Left>
                            <Text>2018-09-15 </Text>
                            <Text>上午11:57</Text>
                        </Left>
                        <Body style={{ alignSelf: "center", paddingLeft: 50 }}>
                            <Text note>收到</Text>
                        </Body>
                        <Text>陳小花</Text>
                    </ListItem>
                    <ListItem>
                        <Left>
                            <Text>2018-09-15 </Text>
                            <Text>上午09:10</Text>
                        </Left>
                        <Body style={{ alignSelf: "center", paddingLeft: 50 }}>
                            <Text note>收到</Text>
                        </Body>
                        <Text>范小翔</Text>
                    </ListItem> */}
                </List>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {
        currentUser: state.auth.currentUser
    }
}

export default connect(mapStateToProps)(RobotHistory);