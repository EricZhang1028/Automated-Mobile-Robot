import React, { Component } from 'react';
import { Container, Content, Text, Left, Body, List, ListItem, Thumbnail } from "native-base";
import { Image } from 'react-native';
// import s3_bucket from '../../AWS/s3_config';

export default class RobotScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      robotAvatar: require('../../img/turtlebot.jpg')
    }
    //this.loadRobotAvatar();
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent)
  }

  // loadRobotAvatar = () => {
  //   const outerThis = this;
  //   var urlParams = { Key: 'avatar/Burger.png' };
  //   s3_bucket.getSignedUrl('getObject', urlParams, function (err, url) {
  //     console.log('the url of the image is', url);
  //     outerThis.setState({
  //       robotAvatar: url
  //     });
  //   });
  // }

  onNavigatorEvent = event => {
    if (event.type === "NavBarButtonPress" && event.id === "sideDrawerToggle") {
      this.props.navigator.toggleDrawer({
        side: "left",
      });
    }
  }

  render() {
    const robotAvatarURI = this.state.robotAvatar;
    return (
      <Container>
        <Content padder>
          <List>
            <ListItem style={{ alignSelf: "center", marginBottom: 30 }} >
              <Image
                style={{ width: 250, height: 150 }}
                source={robotAvatarURI}
              />
            </ListItem>
            <ListItem>
              <Left>
                <Text>機器人名稱：</Text>
              </Left>
              <Text>Turtlebot3 Burger</Text>
            </ListItem>
            <ListItem>
              <Left>
                <Text>狀態：</Text>
              </Left>
              <Text>工作中</Text>
            </ListItem>
            <ListItem>
              <Left>
                <Text>工作佇列：</Text>
              </Left>
              <Text>0</Text>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}