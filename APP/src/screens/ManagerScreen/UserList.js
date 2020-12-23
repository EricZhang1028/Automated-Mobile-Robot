import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { Container, Text, List, ListItem, Left, Body, Thumbnail, Separator } from 'native-base';
import { connect } from 'react-redux';
import db from '../../AWS/dynamodb_config';

class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            targets: []
        }
        this.loadTarget();
    }

    componentWillUnmount() {

    }

    loadTarget = () => {
        const params = {
            TableName: "User",
            ExpressionAttributeNames: {"#user_id":"user_id"},
            ExpressionAttributeValues: {":user_id": "admin"},
            FilterExpression: "#user_id <> :user_id"
            //ProjectionExpression: "user_id, user_name, office_id"
        }
        db.scan(params, (err, data) => {
            console.log("Target List : ", data);
            this.setState({
                targets: data.Items.map((user, i) => {
                    console.log("user = ", user);
                        return {
                            key: i.toString(),
                            user_id: user.user_id,
                            //office_id: user.office_id.S,
                            user_name: user.user_name,
                            office: user.office
                        }
                    
                    
                })
            });
        })
    }

    goToEnterDocumentHandler = (targetUser) => {
        this.props.navigator.push({
            screen: "IM3514_Project.EnterDocumentScreen",
            title: "確認並送出請求",
            passProps: {
                targetUser: targetUser
            }
        });
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
            <Container>
                <List>
                    {/* <Text note style={{ textAlign: "center", paddingTop: 10, paddingBottom: 10 }}>僅顯示目前可收件</Text> */}
                    <FlatList
                        data={this.state.targets}
                        renderItem={info => (
                            <ListItem avatar>
                                <Left>
                                    <Thumbnail source={personalImageDict[info.item.user_name]} />
                                </Left>
                                <Body>
                                    <Text>{info.item.user_name}</Text>
                                    <Text note>{info.item.office.office_id}</Text>
                                </Body>
                            </ListItem>
                        )}
                    />
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

export default connect(mapStateToProps)(UserList);