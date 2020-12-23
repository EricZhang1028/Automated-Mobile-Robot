import React, { Component } from 'react';
import { Container, Content, List, ListItem, Card, CardItem, Text, Left, Right, Icon, Button, Thumbnail } from 'native-base';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import s3_bucket from '../../AWS/s3_config';
import userPool from '../../AWS/cognito_config';
import db from '../../AWS/dynamodb_config';
import profileImage from '../../img/Blank_avatar.jpeg'

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: "/src/img/Blank_avatar.jpeg",
      email: "",
      name: "",
      office: ""
    }
    this.loadData();
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  componentWillUnmount() {

  }

  loadData = () => {
    const outerThis = this;
    var urlParams = { Key: 'avatar/Blank_avatar.jpeg' };
    s3_bucket.getSignedUrl('getObject', urlParams, function (err, url) {
      console.log('the url of the image is', url);
      outerThis.setState({
        avatar: url
      });
    });
    const cognitoUser = this.props.cognitoUser;

    //console.log("office id = ",JSON.stringify(this.props.currentUser.office))
    
    /* Get current user profile */
    // var params = {
    //   TableName: "User",
    //   Key: { "user_id": { S: this.props.currentUser.email } },
    //   ProjectionExpression: "user_id, user_name, office_id"
    // };
    // db.getItem(params, (err, data) => {
    //   this.setState({
    //     email: data.Item.user_id.S,
    //     name: data.Item.user_name.S,
    //     office: data.Item.office_id.S
    //   })
    // });

    // cognitoUser.getUserAttributes(function (err, result) {
    //   if (err) {
    //     alert(err);
    //     return;
    //   }
    //   for (i = 0; i < result.length; i++) {
    //     console.log('attribute [' + i + '] ' + result[i].getName() + ' has value ' + result[i].getValue());
    //   }
    //   outerThis.setState({
    //     email: result[4].getValue(),
    //     //name: result[2].getValue(),
    //     //office: result[3].getValue()
    //   });
    // });
  }

  onNavigatorEvent = event => {
    if (event.type === "NavBarButtonPress" && event.id === "sideDrawerToggle") {
      this.props.navigator.toggleDrawer({
        side: "left",
      });
    }
  }

  changeEmailHandler = () => {
    this.props.navigator.push({
      screen: "IM3514_Project.ChangeEmailScreen",
      title: "變更信箱",
      passProps: {
        email: this.props.currentUser.email
      }
    });
  }
  changeNameHandler = () => {
    this.props.navigator.push({
      screen: "IM3514_Project.ChangeNameScreen",
      title: "變更姓名",
      passProps: {
        name: this.props.currentUser.name
      }
    });
  }
  changeOfficeHandler = () => {
    this.props.navigator.push({
      screen: "IM3514_Project.ChangeOfficeScreen",
      title: "變更辦公室",
      passProps: {
        office: this.props.currentUser.office.office_id.S
      }
    });
  }
  changePasswordHandler = () => {
    this.props.navigator.push({
      screen: "IM3514_Project.ChangePasswordScreen",
      title: "變更密碼"
    });
  }

  goToAvailableListHandler = () => {
    this.props.navigator.push({
      screen: "IM3514_Project.AvailableListScreen",
      title: "可收件時間"
    });
  }

  render() {
    const uri = this.state.avatar;
    return (
      <Container>
        <Content>
          <List>
            <ListItem style={styles.thumbnailContainer}>
              <Thumbnail large source={profileImage/*{ uri: uri }*/} />
            </ListItem>
            <ListItem>
              <Left>
                <Text>電子信箱：{this.props.currentUser.email}</Text>
              </Left>
              {/* <TouchableOpacity onPress={this.changeEmailHandler}>
                <Right style={styles.rightStyle}>
                  <Text style={styles.changeText}>變更 </Text>
                  <Icon name="arrow-forward" />
                </Right>
              </TouchableOpacity> */}
            </ListItem>
            <ListItem>
              <Left>
                <Text>姓名：{this.props.currentUser.name}</Text>
              </Left>
              <TouchableOpacity onPress={this.changeNameHandler}>
                <Right style={styles.rightStyle}>
                  <Text style={styles.changeText}>變更 </Text>
                  <Icon name="arrow-forward" />
                </Right>
              </TouchableOpacity>
            </ListItem>
            <ListItem>
              <Left>
                <Text>辦公室：{this.props.currentUser.office.office_id}</Text>
              </Left>
              <TouchableOpacity onPress={this.changeOfficeHandler}>
                <Right style={styles.rightStyle}>
                  <Text style={styles.changeText}>變更 </Text>
                  <Icon name="arrow-forward" />
                </Right>
              </TouchableOpacity>
            </ListItem>
            <ListItem>
              <Left>
                <Text>可收件時間</Text>
              </Left>
              <TouchableOpacity onPress={this.goToAvailableListHandler}>
                <Right style={styles.rightStyle}>
                  <Text style={styles.changeText}>檢視 </Text>
                  <Icon name="arrow-forward" />
                </Right>
              </TouchableOpacity>
            </ListItem>
            <Button
              rounded
              info
              style={styles.buttonStyle}
              onPress={this.changePasswordHandler}
            >
              <Text>變更密碼</Text>
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

const mapStateToProps = state => {
  return {
    cognitoUser: state.auth.cognitoUser,
    currentUser: state.auth.currentUser
  }
}

export default connect(mapStateToProps)(ProfileScreen);