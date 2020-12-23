import React, { Component } from 'react';
import { View } from 'react-native';
import { Container, List, ListItem, Left, Right, Text } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';

class AvailableListScreen extends Component {
    constructor(props) {
        super(props);
        Promise.all([
            Icon.getImageSource("ios-add", 30, color="blue"), // result 0
        ]).then(result => {
            this.props.navigator.setButtons({
                rightButtons: [
                    {
                        title: '新增可收件時間',
                        icon: result[0],
                        // passProps: {},
                        id: 'addAvailableTime',
                        // testID: 'e2e_is_awesome',
                        // disabled: true,
                        // disableIconTint: true,
                        // buttonFontSize: 14,
                        // buttonFontWeight: '600'
                    }
                ],
                animated: true
            });
        });
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent = event => {
        if (event.type === "NavBarButtonPress" && event.id === "addAvailableTime") {
            this.props.navigator.push({
                screen: "IM3514_Project.AddAvailableTimeScreen",
                title: "新增可收件時間"
            });
        }
    }

    componentWillUnmount() {

    }

    goToEditScreenHandler = () => {
        this.props.navigator.push({
            screen: "IM3514_Project.EditAvailableTimeScreen",
            title: "編輯可收件時間",
            passProps: {}
        })
    }

    render() {
        return (
            <Container>
                <List style={{paddingTop:15}}>
                    <ListItem onPress={this.goToEditScreenHandler}>
                        <Left>
                            <Text>08:00 - 16:00</Text>
                        </Left>
                        <Right>
                            <Text>一、五</Text>
                        </Right>
                    </ListItem>
                    <ListItem>
                        <Left>
                            <Text>13:30 - 16:00</Text>
                        </Left>
                        <Right>
                            <Text>二、三</Text>
                        </Right>
                    </ListItem>
                    <ListItem>
                        <Left>
                            <Text>17:00 - 20:00</Text>
                        </Left>
                        <Right>
                            <Text>四</Text>
                        </Right>
                    </ListItem>
                </List>
            </Container>
        );
    }
}

export default AvailableListScreen;