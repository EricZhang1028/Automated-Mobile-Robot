import React, { Component } from 'react';
import { Container, Content, List, ListItem, Text, Body, Right, Icon, Button } from 'native-base';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Navigation } from 'react-native-navigation'

export default class OfficeList extends Component {

    changeOfficeHandler = () => {
        this.props.navigator.push({
            screen: "IM3514_Project.ChangeOffice",
            title: "編輯辦公室資訊"
        });
    }

    addOfficeHandler = () => {
        this.props.navigator.push({
            screen: "IM3514_Project.AddOffice",
            title: "新增辦公室"
        });
    }

    render() {
        return (
            <Container>
                <Content>
                    <List>
                        <ListItem>
                            <Body>
                                <Text>SL123</Text>
                                <Text note>X:88.32 Y:27.23</Text>
                            </Body>
                            <TouchableOpacity onPress={this.changeOfficeHandler}>
                                <Right style={styles.rightStyle}>
                                    <Text style={styles.changeText}>編輯 </Text>
                                    <Icon name="arrow-forward" />
                                </Right>
                            </TouchableOpacity>
                        </ListItem>
                        <ListItem>
                            <Body>
                                <Text>SL220</Text>
                                <Text note>X:33.39 Y:47.94</Text>
                            </Body>
                            <TouchableOpacity onPress={this.changeOfficeHandler}>
                                <Right style={styles.rightStyle}>
                                    <Text style={styles.changeText}>編輯 </Text>
                                    <Icon name="arrow-forward" />
                                </Right>
                            </TouchableOpacity>
                        </ListItem>
                        <ListItem>
                            <Body>
                                <Text>SL224</Text>
                                <Text note>X:98.23 Y:38.11</Text>
                            </Body>
                            <TouchableOpacity onPress={this.changeOfficeHandler}>
                                <Right style={styles.rightStyle}>
                                    <Text style={styles.changeText}>編輯 </Text>
                                    <Icon name="arrow-forward" />
                                </Right>
                            </TouchableOpacity>
                        </ListItem>
                        <ListItem>
                            <Body>
                                <Text>SL256</Text>
                                <Text note>X:12.01 Y:29.73</Text>
                            </Body>
                            <TouchableOpacity onPress={this.changeOfficeHandler}>
                                <Right style={styles.rightStyle}>
                                    <Text style={styles.changeText}>編輯 </Text>
                                    <Icon name="arrow-forward" />
                                </Right>
                            </TouchableOpacity>
                        </ListItem>
                        <ListItem>
                            <Body>
                                <Text>SL264</Text>
                                <Text note>X:122.33 Y:85.74</Text>
                            </Body>
                            <TouchableOpacity onPress={this.changeOfficeHandler}>
                                <Right style={styles.rightStyle}>
                                    <Text style={styles.changeText}>編輯 </Text>
                                    <Icon name="arrow-forward" />
                                </Right>
                            </TouchableOpacity>
                        </ListItem>
                        <Button
                            rounded
                            info
                            style={styles.buttonStyle}
                            onPress={this.addOfficeHandler}
                        >
                            <Text>新增辦公室</Text>
                        </Button>
                    </List>
                </Content>
            </Container >
        );
    }
}

const styles = StyleSheet.create({
    thumbnailContainer: {
        alignSelf: 'center'
    },
    rightStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    changeText: {
        fontWeight: '100',
        fontSize: 14
    },
    buttonStyle: {
        alignSelf: 'center',
        marginTop: 10
    }
});