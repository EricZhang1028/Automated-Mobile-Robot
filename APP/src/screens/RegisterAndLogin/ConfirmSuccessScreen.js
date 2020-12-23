import React, { Component } from 'react';
import { Form, Item, Input, Label, Button, Text } from 'native-base';
import { View, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';

export default class LoginScreen extends Component {
    backToLoginHandler = () => {
        this.props.navigator.resetTo({
            screen: 'IM3514_Project.LoginScreen', // unique ID registered with Navigation.registerScreen
            title: "登入", // navigation bar title of the pushed screen (optional)
            animated: true, // does the resetTo have transition animation or does it happen immediately (optional)
            animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the resetTo have different transition animation (optional)
        });
    }

    render() {
        return (
            // 按外面會收起鍵盤
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <KeyboardAvoidingView style={styles.container} behavior="padding">
                        <Text style={{ fontSize: 20 }}>恭喜！</Text>
                        <Text style={{ fontSize: 20 }}>{ this.props.message }</Text>
                        <View style={styles.buttonContainer}>
                            <Button
                                rounded success
                                style={styles.loginButton}
                                onPress={this.backToLoginHandler}>
                                <Text>返回登入</Text>
                            </Button>
                        </View>
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