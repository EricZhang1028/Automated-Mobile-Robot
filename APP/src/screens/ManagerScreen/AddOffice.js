import React, { Component } from 'react';
import { Container, Form, Item, Input, Label, Text, Button } from 'native-base';
import { View, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';

export default class addOffice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            office: ""
        };
    }

    render() {
        return (
            // 按外面會收起鍵盤
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView>
                    <Container style={styles.container}>
                        <KeyboardAvoidingView behavior="padding">
                            <Form style={styles.form}>
                                <Item floatingLabel>
                                    <Label>辦公室(SL)</Label>
                                    <Input
                                        keyboardType="numeric"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        returnKeyType="next"
                                        value={this.state.office}
                                    />
                                </Item>
                                <Item floatingLabel>
                                    <Label>X 座標</Label>
                                    <Input
                                        keyboardType="numeric"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        returnKeyType="next"
                                        value={this.state.office}
                                    />
                                </Item>
                                <Item floatingLabel>
                                    <Label>Y 座標</Label>
                                    <Input
                                        keyboardType="numeric"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        returnKeyType="next"
                                        value={this.state.office}
                                    />
                                </Item>

                                <View style={styles.buttonContainer}>
                                    <Button
                                        bordered success
                                        style={styles.registerButton}
                                    //onPress={this.submitHandler}
                                    >
                                        <Text>確認</Text>
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