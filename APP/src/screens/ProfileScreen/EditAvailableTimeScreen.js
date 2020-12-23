import React, { Component } from 'react';
import { View, StyleSheet, DatePickerIOS } from 'react-native';
import { Container, Content, Form, Item, Text, Label, Input, Button } from 'native-base';
import MultiSelect from 'react-native-multiple-select';
import Icon from 'react-native-vector-icons/Ionicons';

class EditAvailableTimeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
            chosenTime1: new Date(),
            chosenTime2: new Date(),
            showTimePicker1: false,
            showTimePicker2: false
        };

        this.setTime1 = this.setTime1.bind(this);
        this.setTime2 = this.setTime2.bind(this);

        this.items = [{
            id: '1',
            name: '一',
        }, {
            id: '2',
            name: '二',
        }, {
            id: '3',
            name: '三',
        }, {
            id: '4',
            name: '四',
        }, {
            id: '5',
            name: '五',
        }, {
            id: '6',
            name: '六',
        }, {
            id: '7',
            name: '日',
        }];

        Promise.all([
            Icon.getImageSource("ios-trash", 30, color="#ff0000"), // result 0
        ]).then(result => {
            this.props.navigator.setButtons({
                rightButtons: [
                    {
                        title: '新增可收件時間',
                        icon: result[0],
                        // passProps: {},
                        id: 'deleteAvailableTime',
                    }
                ],
                animated: true
            });
        });
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent = event => {
        if (event.type === "NavBarButtonPress" && event.id === "deleteAvailableTime") {
            // delete item
            console.log("Delete item.");
        }
    }

    componentWillUnmount() {

    }

    onValueChange(value) {
        this.setState({
            selected: value
        });
    }

    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });
    };

    setTime1(newTime) {
        this.setState({ chosenTime1: newTime });
        console.log("Chosen time1: %d:%d",
            this.state.chosenTime1.getHours(),
            this.state.chosenTime1.getMinutes());
    }

    setTime2(newTime) {
        this.setState({ chosenTime2: newTime });
        console.log("Chosen time2: %d:%d",
            this.state.chosenTime2.getHours(),
            this.state.chosenTime2.getMinutes());
    }

    showTimePickerHandler1 = () => {
        this.setState({ 
            showTimePicker1: true,
            showTimePicker2: false
        });
    }

    closeTimePickerHandler1 = () => {
        this.setState({ showTimePicker1: false });
    }

    showTimePickerHandler2 = () => {
        this.setState({ 
            showTimePicker2: true,
            showTimePicker1: false
        });
    }

    closeTimePickerHandler2 = () => {
        this.setState({ showTimePicker2: false });
    }

    pad = number => {
        return number < 10 ? '0' + number : number;
    }

    render() {
        const { selectedItems } = this.state;
        return (
            <Container style={styles.container}>
                <Content>
                    <Form>
                        <Text>星期</Text>
                        <MultiSelect
                            hideTags
                            items={this.items}
                            uniqueKey="id"
                            ref={(component) => { this.multiSelect = component }}
                            onSelectedItemsChange={this.onSelectedItemsChange}
                            selectedItems={selectedItems}
                            selectText="請選擇星期"
                            // searchInputPlaceholderText="Search Items..."
                            onChangeInput={(text) => console.log(text)}
                            // altFontFamily="ProximaNova-Light"
                            tagRemoveIconColor="#e12323"
                            tagBorderColor="#e12323"
                            tagTextColor="#e12323"
                            selectedItemTextColor="#e12323"
                            selectedItemIconColor="#e12323"
                            itemTextColor="#e12323"
                            displayKey="name"
                            searchInputStyle={{ color: '#CCC' }}
                            submitButtonColor="#CCC"
                            submitButtonText="確認"
                        />
                        <View>
                            {this.multiSelect ? this.multiSelect.getSelectedItemsExt(selectedItems) : null}
                        </View>
                        <Item style={{paddingTop: 10}}>
                            <Label>從</Label>
                            <Input
                                style={{textAlign:"center"}}
                                editable={false}                                
                                value={
                                    this.pad(this.state.chosenTime1.getHours()) + ":" +
                                    this.pad(this.state.chosenTime1.getMinutes())
                                }
                            />
                            <Button transparent danger onPress={this.showTimePickerHandler1}>
                                <Text>選擇</Text>
                            </Button>
                        </Item>
                        <Item>
                            <Label>到</Label>
                            <Input
                                style={{textAlign:"center"}}
                                editable={false}                                
                                value={
                                    this.pad(this.state.chosenTime2.getHours()) + ":" +
                                    this.pad(this.state.chosenTime2.getMinutes())
                                }
                            />
                            <Button transparent danger onPress={this.showTimePickerHandler2}>
                                <Text>選擇</Text>
                            </Button>
                        </Item>
                        {this.state.showTimePicker1 &&
                            (<View>
                                <DatePickerIOS
                                    date={this.state.chosenTime1}
                                    onDateChange={this.setTime1}
                                    mode="time"
                                />
                                <Button 
                                    transparent 
                                    onPress={this.closeTimePickerHandler1}
                                    style={{alignSelf:"center"}}>
                                    <Text>收起</Text>
                                </Button>
                            </View>)
                        }
                        {this.state.showTimePicker2 &&
                            (<View>
                                <DatePickerIOS
                                    date={this.state.chosenTime2}
                                    onDateChange={this.setTime2}
                                    mode="time"
                                />
                                <Button 
                                    transparent 
                                    onPress={this.closeTimePickerHandler2}
                                    style={{alignSelf:"center"}}>
                                    <Text>收起</Text>
                                </Button>
                            </View>)
                        }
                        <Button rounded style={{marginTop:10, alignSelf:"center"}}>
                            <Text>確認變更</Text>
                        </Button>
                    </Form>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        width: "80%",
        paddingTop: 20
    }
});

export default EditAvailableTimeScreen;