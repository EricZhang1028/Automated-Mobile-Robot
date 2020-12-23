import React, { Component } from 'react';
import { Form, Item, Input, Label, Button, Text, Container, Picker, Icon } from 'native-base';
import { View, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView, FlatList } from 'react-native';
import db from '../../AWS/dynamodb_config';
import userPool from '../../AWS/cognito_config';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';

export default class RegisterScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
            office: "",
            officeList: []
        };
        this.loadOffice();
    }

    loadOffice = () => {
        const params = {
            TableName: "Map",
            ProjectionExpression: "pose, office_id"
        }
        db.scan(params, (err, data) => {
            console.log("office list : ", data)
            this.setState({
                officeList: data.Items,  // Office array
                office: data.Items[0].office_id
            })
        })
    }

    registerHandler = () => {
        const attributeList = [];
        attributeList.push(new CognitoUserAttribute({ Name: 'email', Value: this.state.email }));
        attributeList.push(new CognitoUserAttribute({ Name: 'name', Value: this.state.name }));
        attributeList.push(new CognitoUserAttribute({ Name: 'custom:office', Value: this.state.office }));
        var cognitoUser;

        //Call SignUp function
        userPool.signUp(this.state.email, this.state.password,
            attributeList, null, (err, result) => {
                if (err) {
                    console.log('Error at signup', err);
                    return;
                }
                cognitoUser = result.user;
                console.log('cognitoUser', cognitoUser);

                // Get selected office object
                const selectedOffice = this.state.officeList.find(item => { return item.office_id === this.state.office })
                console.log("selected office = ", selectedOffice);

                /* Add new user to dynamoDB */
                var userParams = {
                    TableName: "User",
                    Item: {
                        "user_id": this.state.email,
                        "user_name": this.state.name ,
                        "use_record_count": "0",
                        "cancel_count": "0",
                        "not_received_count": "0" ,
                        "confirm": false,
                        "office": selectedOffice
                    }
                }
                db.put(userParams, (err, data) => {
                    if (data == null) {
                        console.log("Add new user fail.")
                    } else {
                        console.log("Add new user success!");
                    }
                })

                // Update office user in "Map" table (Because no relation......)
                const officeParams = {
                    TableName: "Map",
                    Key: { "office_id": this.state.office },
                    ExpressionAttributeNames: { "#user_id": "user_id" },
                    ExpressionAttributeValues: { ":user_id": this.state.email },
                    UpdateExpression: "SET #user_id = :user_id"
                }
                db.update(officeParams, (err, data) => {
                    console.log(data != null ? "Register success!" : "Register fail...");
                })

                this.props.navigator.resetTo({
                    screen: 'IM3514_Project.ConfirmationScreen', // unique ID registered with Navigation.registerScreen
                    title: '驗證信箱', // title of the screen as appears in the nav bar (optional)
                    passProps: {
                        email: this.state.email
                    },
                    animated: true,
                    animationType: 'fade',
                });
            }
        );
    }

    onValueChange(value) {
        this.setState({
            office: value,
        });
    }

    render() {
        const officeMenu = this.state.officeList.map((item, index) => {
            return (
                <Picker.Item value={item.office_id} label={item.office_id} key={index} />
            );
        });

        return (
            // 按外面會收起鍵盤
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView>
                    <Container style={styles.container}>
                        <KeyboardAvoidingView behavior="padding">
                            <Form style={styles.form}>
                                <Item floatingLabel>
                                    <Label>電子信箱</Label>
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
                                <Item floatingLabel>
                                    <Label>密碼</Label>
                                    <Input
                                        secureTextEntry
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        getRef={(input) => this.passwordInput = input}
                                        returnKeyType="next"
                                        onSubmitEditing={(event) => this.confirmPasswordInput._root.focus()}
                                        value={this.state.password}
                                        onChangeText={(inputPassword) => this.setState({ password: inputPassword })}
                                    />
                                </Item>
                                <Item floatingLabel>
                                    <Label>確認密碼</Label>
                                    <Input
                                        secureTextEntry
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        getRef={(input) => this.confirmPasswordInput = input}
                                        returnKeyType="next"
                                        onSubmitEditing={(event) => this.nameInput._root.focus()}
                                        value={this.state.confirmPassword}
                                        onChangeText={(inputConfirmPassword) => this.setState({ confirmPassword: inputConfirmPassword })}
                                    />
                                </Item>
                                <Item floatingLabel>
                                    <Label>姓名</Label>
                                    <Input
                                        autoCorrect={false}
                                        getRef={(input) => this.nameInput = input}
                                        returnKeyType="next"
                                        onSubmitEditing={(event) => this.officeInput._root.focus()}
                                        value={this.state.name}
                                        onChangeText={(inputName) => this.setState({ name: inputName })}
                                    />
                                </Item>
                                <Item style={{ flexDirection: 'row', width: "95%" }}>
                                <Label>辦公室(SL)</Label>
                                    <Picker
                                        selectedValue={this.state.office}
                                        onValueChange={this.onValueChange.bind(this)}
                                    >
                                        {officeMenu}
                                    </Picker>
                                    {/* <Input
                                        autoCorrect={false}
                                        getRef={(input) => this.officeInput = input}
                                        keyboardType="numeric"
                                        returnKeyType="go"
                                        onSubmitEditing={(event) => this.registerHandler()}
                                        value={this.state.office}
                                        onChangeText={(inputOffice) => this.setState({ office: inputOffice })}
                                    /> */}
                                </Item>
                                {/* <Item>
                                    <View style={{flexDirection: 'row', width: "100%"}}>
                                        <Label style={{textAlign: 'left'}}>辦公室(SL)</Label>
                                        <Picker
                                            style={{  }}
                                            selectedValue={this.state.office}
                                            onValueChange={this.onValueChange.bind(this)}
                                        >
                                            {officeMenu}
                                        </Picker>
                                    </View>
                                </Item> */}
                                <View style={styles.buttonContainer}>
                                    <Button
                                        bordered success
                                        style={styles.registerButton}
                                        onPress={this.registerHandler}
                                    >
                                        <Text>確認註冊</Text>
                                    </Button>
                                </View>
                            </Form>
                        </KeyboardAvoidingView>


                    </Container>
                </ScrollView>

            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    form: {
        width: "90%",
        alignItems: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    registerButton: {
        padding: 10,
        margin: 20,
        alignSelf: 'center',
    }
});