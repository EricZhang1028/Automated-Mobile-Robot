import React, { Component } from 'react';

import { Container, Text, Input, Button, Label, Item, Form } from 'native-base';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { setCurrentUser } from '../../store/actions/authActions';
import db from '../../AWS/dynamodb_config';

class ChangeNameScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name
        };
    }

    resetNameHandler = () => {
        const userParams = {
            TableName: "User",
            ExpressionAttributeNames: {"#user_name": "user_name"},
            ExpressionAttributeValues: {":user_name": this.state.name},
            Key: {"user_id": this.props.currentUser.email},
            UpdateExpression: "SET #user_name = :user_name"
        }
        db.update(userParams, (err, data) => {
            console.log(data != null ? "USER --> Reset name success!" : "USER --> Reset name fail...");
        })

        // const recordParams = {
        //     TableName: "Record",
        //     ExpressionAttributeNames: { "#requester_name": "requester_name" },
        //     ExpressionAttributeValues: { ":requester_name": this.state.name },
        //     Key: { "user_id": this.props.currentUser.email },
        //     UpdateExpression: "SET #requester_name = :requester_name"
        // };
        // db.update(recordParams, (err, data) => {
        //     if(err){
        //         console.log("RO err : ", err)
        //     }
        //     console.log(data != null ? "ROCORD --> Reset name success!" : "RECORD --> Reset name fail...");
        // })

        this.props.setCurrentUser({
            email: this.props.currentUser.email,
            name: this.state.name,
            office: this.props.currentUser.office
        })

        this.props.navigator.resetTo({
            screen: "IM3514_Project.ProfileScreen",
            title: "個人資料"
        });
    }

    render() {
        return (
            <Container style={styles.container}>
                <Form style={styles.inputContainer}>
                    <Item>
                        <Label>您目前姓名：</Label>
                        <Input
                            value={this.props.name}
                            editable={false}
                        />
                    </Item>
                    <Item>
                        <Label>請輸入新姓名：</Label>
                        <Input 
                        autoCorrect={false}
                        onChangeText={(inputName) => this.setState({ name: inputName })}
                        />
                    </Item>
                </Form>
                <Button transparent style={styles.buttonStyle} onPress={this.resetNameHandler}>
                    <Text>確認</Text>
                </Button>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    inputContainer: {
        alignItems: 'center',
        width: "90%",
    },
    buttonStyle: {
        marginTop: 10,
        alignSelf: 'center',
    }
});

const mapStateToProps = state => {
    return {
        currentUser: state.auth.currentUser
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setCurrentUser: currentUser => dispatch(setCurrentUser(currentUser)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangeNameScreen);