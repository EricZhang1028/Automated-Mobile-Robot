import React, { Component } from 'react';
import { Form, Item, Input, Label, Button, Text } from 'native-base';
import { View, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';

import { CognitoUser } from 'amazon-cognito-identity-js';
import userPool from '../../AWS/cognito_config';

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            cognitoUser: null
        };
    }

    forgotPasswordHandler = () => {
        this.state.cognitoUser = new CognitoUser({
            Username: this.state.email,
            Pool: userPool
        });
        console.log("This 1: ", this);
        const outerThis = this;
        this.state.cognitoUser.forgotPassword({
            onSuccess: function (result) {
                console.log('call result: ' + result);
            },
            onFailure: function (err) {
                alert(err);
            },
            inputVerificationCode() {
                console.log("This 2: ", outerThis.state.cognitoUser);
                outerThis.props.navigator.resetTo({
                    screen: 'IM3514_Project.ResetPasswordScreen', // unique ID registered with Navigation.registerScreen
                    title: "Reset Password", // navigation bar title of the pushed screen (optional)
                    passProps: {
                        cognitoUser: outerThis.state.cognitoUser
                    },
                    animated: true,
                    animationType: 'fade',
                });
                // var verificationCode = prompt('Please input verification code ', '');
                // var newPassword = prompt('Enter new password ', '');
                // cognitoUser.confirmPassword(verificationCode, newPassword, this);
            }
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
                                <Label>電子信箱</Label>
                                <Input
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    returnKeyType="go"
                                    value={this.state.email}
                                    onChangeText={(inputEmail) => this.setState({ email: inputEmail })}
                                />
                            </Item>
                            <View style={styles.buttonContainer}>
                                <Button
                                    danger
                                    style={styles.loginButton}
                                    onPress={this.forgotPasswordHandler}>
                                    <Text>下一步</Text>
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