import React, { Component } from 'react';
import { Form, Item, Input, Label, Button, Text } from 'native-base';
import { View, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Picker } from 'react-native';

import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import userPool from '../../AWS/cognito_config';
import db from '../../AWS/dynamodb_config';
import MainTabs from '../MainTabs/MainTabs';
import AdminScreen from '../MainTabs/AdminMainScreen';

import { connect } from 'react-redux';
import { setCognitoUser, setCurrentUser } from '../../store/actions/authActions';

class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            user: "",
        };
    }

    componentWillUnmount() {

    }

    loginHandler = () => {
        if (this.state.email === 'admin' && this.state.password === 'admin') {
            AdminScreen();
        }
        else {
            const authenticationDetails = new AuthenticationDetails({
                Username: this.state.email,
                Password: this.state.password
            });
            const cognitoUser = new CognitoUser({
                Username: this.state.email,
                Pool: userPool
            });
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: (result) => {
                    console.log('onSuccess', typeof (result), result);
                    console.log('access token + ' + result.getAccessToken().getJwtToken());
                    console.log("CognitoUser1: ", typeof (cognitoUser), cognitoUser);
                    this.props.setCognitoUser(cognitoUser);

                    /* Get user information from dynamodb */
                    const params = {
                        TableName: "User",
                        Key: { "user_id": this.state.email },
                        ProjectionExpression: "user_id, user_name, office"
                    };
                    db.get(params, (err, data) => {
                        const currentUser = {
                            email: data.Item.user_id,
                            name: data.Item.user_name,
                            office: data.Item.office
                        }
                        this.props.setCurrentUser(currentUser);
                        MainTabs();
                    });
                    // cognitoUser.setDeviceStatusRemembered({
                    //     onSuccess: function (result) {
                    //         console.log('call result: ' + result);
                    //     },
                    //     onFailure: function(err) {
                    //         alert(err);
                    //     }
                    // });

                },
                onFailure: (err) => {
                    console.log('onFailure', err);
                    alert("Error: ", err);
                },
                mfaRequired: (codeDeliveryDetails) => {
                    console.log('mfaRequired', codeDeliveryDetails),
                        alert(codeDeliveryDetails);
                }
            });
        }
    }
    goToRegisterHandler = () => {
        this.props.navigator.push({
            screen: "IM3514_Project.RegisterScreen",
            title: "註冊帳號",
            animationType: 'fade'
        });
    }
    goToForgotPasswordHandler = () => {
        this.props.navigator.push({
            screen: "IM3514_Project.ForgotPasswordScreen",
            title: "忘記密碼",
            animationType: 'fade'
        })
    }

    render() {
        return (



            // 按外面會收起鍵盤
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <KeyboardAvoidingView style={styles.container} behavior="padding">
                        <Text style={{ fontSize: 22, fontFamily: "Arial" }}>請登入！</Text>
                        <Form style={styles.form}>
                            <Item floatingLabel>
                                <Label>帳號(電子信箱)</Label>
                                <Input
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    returnKeyType="next"
                                    onSubmitEditing={(event) => this.passwordInput._root.focus()}
                                    value={this.state.email}
                                    onChangeText={(inputEmail) => this.setState({ email: inputEmail })}
                                />
                            </Item>
                            <Item floatingLabel last>
                                <Label>密碼</Label>
                                <Input
                                    secureTextEntry
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    getRef={(input) => this.passwordInput = input}
                                    returnKeyType="go"
                                    value={this.state.password}
                                    onChangeText={(inputPassword) => this.setState({ password: inputPassword })}
                                />
                            </Item>
                            
                            <View style={styles.buttonContainer}>
                                <Button
                                    bordered
                                    style={styles.loginButton}
                                    onPress={this.loginHandler}
                                >
                                    <Text>登入</Text>
                                </Button>
                                <Button
                                    bordered
                                    style={styles.loginButton}
                                    onPress={this.goToRegisterHandler}>
                                    <Text>註冊帳號</Text>
                                </Button>
                                <Button
                                    transparent
                                    style={styles.loginButton}
                                    onPress={this.goToForgotPasswordHandler}>
                                    <Text>忘記密碼</Text>
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

const mapStateToProps = state => {
    return {
        cognitoUser: state.cognitoUser
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setCurrentUser: currentUser => dispatch(setCurrentUser(currentUser)),
        setCognitoUser: cognitoUser => dispatch(setCognitoUser(cognitoUser))
    }
}

export default connect(mapStateToProps, mapDispatchToProps/*{ setCurrentUser, setCognitoUser }*/)(LoginScreen);
// export default LoginScreen;