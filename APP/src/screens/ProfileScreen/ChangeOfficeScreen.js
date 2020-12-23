import React, { Component } from 'react';

import { Container, Text, Input, Button, Label, Item, Form, Picker, Icon } from 'native-base';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { setCurrentUser } from '../../store/actions/authActions';
import db from '../../AWS/dynamodb_config';

class ChangeOfficeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            office: "",
            officeList: []
        }
        this.loadOffice();
        console.log("current office : ", this.props.office);
    }

    loadOffice = () => {
        const params = {
            TableName: "Map",
            ProjectionExpression: "pose, office_id"
        }
        db.scan(params, (err, data) => {
            console.log("office list : ", data)
            this.setState({
                officeList: data.Items,
                office: data.Items[0].office_id
            })
        })
    }

    onValueChange(value) {
        this.setState({
            office: value,
        });
    }

    resetOfficeHandler = () => {

        // Get selected office object
        const selectedOffice = this.state.officeList.find(item => { return item.office_id === this.state.office })
        console.log("selected office = ", selectedOffice);
        const userParams = {
            TableName: "User",
            ExpressionAttributeNames: { "#office": "office" },
            ExpressionAttributeValues: { ":office": selectedOffice },
            Key: { "user_id": this.props.currentUser.email },
            UpdateExpression: "SET #office = :office"
        }
        db.update(userParams, (err, data) => {
            console.log(data != null ? "Reset User office success!" : "Reset User office fail...");
        })

        const officeParams = {
            TableName: "Map",
            Key: { "office_id": this.state.office },
            ExpressionAttributeNames: { "#user_id": "user_id" },
            ExpressionAttributeValues: { ":user_id": this.props.currentUser.email },
            UpdateExpression: "SET #user_id = :user_id"
        }
        db.update(officeParams, (err, data) => {
            console.log(data != null ? "Reset Map success!" : "Reset Map fail...");
        })

        this.props.setCurrentUser({
            email: this.props.currentUser.email,
            name: this.props.currentUser.name,
            office: selectedOffice
        })

        this.props.navigator.resetTo({
            screen: "IM3514_Project.ProfileScreen",
            title: "個人資料"
        });
    }

    render() {
        const officeMenu = this.state.officeList.map((item, index) => {
            return (
                <Picker.Item value={item.office_id} label={item.office_id} key={index} />
            );
        });

        return (
            <Container style={styles.container}>
                <Form style={styles.inputContainer}>
                    <Item>
                        <Label>您目前辦公室：</Label>
                        <Input
                            value={this.props.currentUser.office.office_id}
                            editable={false}
                        />
                    </Item>
                    <Item style={{ width: "95%" }}>
                        <Label>請輸入新辦公室：</Label>
                        <Picker
                            selectedValue={this.state.office}
                            onValueChange={this.onValueChange.bind(this)}
                        >
                            { officeMenu }
                        </Picker>
                        {/* <Input
                            autoCorrect={false}
                            onChangeText={(inputOffice) => this.setState({ office: inputOffice })}
                            keyboardType="numeric"
                        /> */}
                    </Item>

                </Form>
                <Button transparent style={styles.buttonStyle} onPress={this.resetOfficeHandler}>
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
        width: "90%",
        alignItems: 'center',
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangeOfficeScreen)