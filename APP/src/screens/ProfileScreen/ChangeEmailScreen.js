import React, { Component } from 'react';

import { Container, Text, Input, Button, Label, Item, Form } from 'native-base';
import { StyleSheet } from 'react-native';

export default class ChangeEmailScreen extends Component {
    render() {
        return (
            <Container style={styles.container}>
                <Form style={styles.inputContainer}>
                    <Item>
                        <Label>您目前電子信箱：</Label>
                        <Input
                            value={this.props.email}
                            editable={false}
                        />
                    </Item>
                    <Item>
                        <Label>請輸入新電子信箱：</Label>
                        <Input />
                    </Item>
                </Form>
                <Button transparent style={styles.buttonStyle}>
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