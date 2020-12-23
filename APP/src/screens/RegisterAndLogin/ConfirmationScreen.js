import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';
import { Form, Item, Input, Label, Button, Text } from 'native-base';
import { View, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import db from '../../AWS/dynamodb_config';
import { CognitoUser } from 'amazon-cognito-identity-js';
import userPool from '../../AWS/cognito_config';

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
        };
    }

    confirmHandler = () => {
        const cognitoUser = new CognitoUser({
            Username: this.props.email,
            Pool: userPool
        });
        cognitoUser.confirmRegistration(this.state.code, true, (err, result) => {
            if (err) {
                alert("Error: ", err);
                console.log("Error m: ", err);
                return;
            }
            console.log("Success m: ", result);

            /* DynamoDB : Update confirm attribute  */
            var params = {
                TableName: "User",
                ExpressionAttributeNames: {"#confirm": "confirm"},
                ExpressionAttributeValues: {":t": true},
                Key: {"user_id": this.props.email},
                UpdateExpression: "SET #confirm = :t"
            }
            db.update(params, function(err, data) {
                console.log(data != null ? "Confrim success!" : "Confirm fail...");
            });

            this.props.navigator.resetTo({
                screen: 'IM3514_Project.ConfirmSuccessScreen', // unique ID registered with Navigation.registerScreen
                title: "完成驗證信箱", // navigation bar title of the pushed screen (optional)
                animated: true,
                animationType: 'fade',
                passProps: {
                    message: "您的帳號已成功通過驗證！"
                }
            });
        });
    }

    render() {
        return (
            // 按外面會收起鍵盤
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <KeyboardAvoidingView style={styles.container} behavior="padding">
                        <Form style={styles.form}>
                            <Item floatingLabel>
                                <Label>請輸入驗證碼</Label>
                                <Input
                                    keyboardType="number-pad"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    returnKeyType="go"
                                    value={this.state.code}
                                    onChangeText={(inputCode) => this.setState({ code: inputCode })}
                                />
                            </Item>
                            <View style={styles.buttonContainer}>
                                <Button
                                    transparent danger
                                    style={styles.loginButton}
                                    onPress={this.confirmHandler}>
                                    <Text>確認</Text>
                                </Button>
                            </View>
                        </Form>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: "#85C1E9",
    },
    form: {
        width: "80%",
        alignItems: 'center'
    },
    buttonContainer: {
        flexDirection: 'column',
    },
    loginButton: {
        padding: 10,
        marginTop: 10,
        margin: 5,
        alignSelf: 'center',
    }
});