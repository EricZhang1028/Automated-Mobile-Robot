import React, { Component } from 'react';
import { View } from 'react-native';
import { Container, Card, CardItem, Text, Button, Icon } from 'native-base';
import { ConfirmDialog } from 'react-native-simple-dialogs';

class ReviewComingStateScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false
        }
    }

    componentWillUnmount() {

    }

    backToHomeHandler = () => {
        this.props.navigator.resetTo({
            screen: "IM3514_Project.HomeScreen",
            title: "首頁"
        });
    }

    cancelRequestHandler = () => {
        this.setState({ dialogVisible: true });
    }

    closeDialog = () => {
        this.setState({ dialogVisible: false });
    }

    render() {
        return (
            <Container>
                <View style={{ alignSelf: "center", flexDirection: "row", marginTop: 30, marginBottom: 10 }}>
                    <Icon name="arrow-back" style={{ fontSize: 100, color: "#00bfff" }} />
                    <Icon name="arrow-back" style={{ fontSize: 100, color: "#00bfff" }} />
                    <Icon name="arrow-back" style={{ fontSize: 100, color: "#00bfff" }} />
                </View>
                <View style={{ alignSelf: "center" }}>
                    <Text style={{ fontSize: 30 }}>機器人前往領件中...</Text>
                </View>
                <Card style={{ width: "80%", alignSelf: "center", marginTop: 20 }}>
                    <CardItem></CardItem>
                    <CardItem style={{ alignSelf: "center" }}>
                        <Text>寄件人：施大霖</Text>
                    </CardItem>
                    <CardItem style={{ alignSelf: "center" }}>
                        <Text>辦公室：SL276</Text>
                    </CardItem>
                    <CardItem style={{ alignSelf: "center" }}>
                        <Text>工作排序：4</Text>
                    </CardItem>
                    <CardItem></CardItem>
                </Card>
                <View style={{ alignSelf: "center", flexDirection: "row", marginTop: 20 }}>
                    {/* <Button block success onPress={this.backToHomeHandler}
                        style={{ marginRight: 20 }}>
                        <Text>確定</Text>
                    </Button> */}
                    <Button block danger onPress={this.cancelRequestHandler}
                        style={{ marginLeft: 20 }}>
                        <Text>取消請求</Text>
                    </Button>
                </View>
                {this.state.dialogVisible &&
                    <ConfirmDialog
                        title="確認取消領件請求"
                        message="您是否確定取消領件請求？"
                        visible={this.state.dialogVisible}
                        onTouchOutside={() => this.setState({ dialogVisible: false })}
                        positiveButton={{
                            title: "是",
                            onPress: this.backToHomeHandler
                        }}
                        negativeButton={{
                            title: "否",
                            onPress: this.closeDialog
                        }
                        }
                    />
                }
            </Container>
        );
    }
}

export default ReviewComingStateScreen;