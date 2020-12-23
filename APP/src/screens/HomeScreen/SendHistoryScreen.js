import React, { Component } from 'react';
import { Container, List, ListItem, Left, Body, Right, Text } from 'native-base';
import { FlatList } from 'react-native';
import { connect } from "react-redux";
import db from '../../AWS/dynamodb_config';

class SendHistoryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestedHistory: [],
        }
        this.loadRequestHistory();
    }

    loadRequestHistory = () => {
        var requestedHistoryParams = {
            TableName: "Record",
            KeyConditionExpression: "#user_id = :user_id",
            ExpressionAttributeNames: { "#user_id": "user_id" },
            ExpressionAttributeValues: { ":user_id": this.props.currentUser.email },
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
                            "request_time_day": record.request_time.split(' ')[0],
                            "request_time_time": record.request_time.split(' ')[1],
                            "receiver_name": record.receiver_name
                        };
                    })
                })
            }
        });
    }

    render() {
        return (
            <Container>
                <List>
                    <FlatList
                        data={this.state.requestedHistory}
                        renderItem={info => (
                            <ListItem>
                                <Left>
                                    <Text>{info.item.request_time_day} </Text>
                                    <Text>{info.item.request_time_time}</Text>
                                </Left>
                                <Body style={{ alignSelf: "center", paddingLeft: 50 }}>
                                    <Text note>送出</Text>
                                </Body>
                                <Text>{info.item.receiver_name}</Text>
                            </ListItem>
                        )}
                    />

                    {/* <ListItem>
                        <Left>
                            <Text>2018-09-15 </Text>
                            <Text>下午03:30</Text>
                        </Left>
                        <Body style={{ alignSelf: "center", paddingLeft:50 }}>
                            <Text note>送出</Text>
                        </Body>
                        <Text>范大強</Text>
                    </ListItem>
                    <ListItem>
                        <Left>
                            <Text>2018-09-15 </Text>
                            <Text>上午09:30</Text>
                        </Left>
                        <Body style={{ alignSelf: "center", paddingLeft:50 }}>
                            <Text note>送出</Text>
                        </Body>
                        <Text>陳小花</Text>
                    </ListItem>
                    <ListItem>
                        <Left>
                            <Text>2018-09-14 </Text>
                            <Text>上午09:10</Text>
                        </Left>
                        <Body style={{ alignSelf: "center", paddingLeft:50 }}>
                            <Text note>送出</Text>
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
    };
};

export default connect(mapStateToProps)(SendHistoryScreen);