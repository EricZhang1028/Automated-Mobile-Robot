import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';
import { Form, Item, Input, Label, Button, Text } from 'native-base';
import { View, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';

import { CognitoUser } from 'amazon-cognito-identity-js';
import userPool from '../../AWS/cognito_config';

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            verificationCode: "",
            newPassword: "",
            confirmNewPassword: "",
        };
    }

    resetPasswordHandler = () => {
        console.log("cognitoUser: ", this.props.cognitoUser);
        console.log(this.state.verificationCode, this.state.newPassword);
        const outerThis = this;
        this.props.cognitoUser.confirmPassword(this.state.verificationCode, this.state.newPassword, {
            onSuccess() {
                console.log('Password confirmed!');
                outerThis.props.navigator.resetTo({
                    screen: 'IM3514_Project.ConfirmSuccessScreen', // unique ID registered with Navigation.registerScreen
                    title: "密碼已重設", // navigation bar title of the pushed screen (optional)
                    animated: true,
                    animationType: 'fade',
                    passProps: {
                        message: "您的密碼已重新設定！"
                    }
                });
            },
            onFailure(err) {
                console.log('Password not confirmed!');
                alert('Failed!');
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
                                <Label>請輸入驗證碼</Label>
                                <Input
                                    keyboardType="number-pad"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    returnKeyType="next"
                                    onSubmitEditing={(event) => this.newPasswordInput._root.focus()}
                                    value={this.state.verificationCode}
                                    onChangeText={(inputCode) => this.setState({ verificationCode: inputCode })}
                                />
                            </Item>
                            <Item floatingLabel last>
                                <Label>請輸入新密碼</Label>
                                <Input
                                    secureTextEntry
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    getRef={(input) => this.newPasswordInput = input}
                                    returnKeyType="next"
                                    onSubmitEditing={(event) => this.confirmNewPasswordInput._root.focus()}
                                    value={this.state.newPassword}
                                    onChangeText={(inputPassword) => this.setState({ newPassword: inputPassword })}
                                />
                            </Item>
                            <Item floatingLabel>
                                <Label>確認新密碼</Label>
                                <Input
                                    secureTextEntry
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    getRef={(input) => this.confirmNewPasswordInput = input}
                                    returnKeyType="go"
                                    value={this.state.confirmNewPassword}
                                    onChangeText={(inputConfirmPassword) => this.setState({ confirmNewPassword: inputConfirmPassword })}
                                />
                            </Item>
                            <View style={styles.buttonContainer}>
                                <Button
                                    transparent danger
                                    style={styles.loginButton}
                                    onPress={this.resetPasswordHandler}>
                                    <Text>重設密碼</Text>
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