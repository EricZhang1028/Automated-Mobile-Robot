import React, { Component } from 'react';
import { Text, View, Dimensions, StyleSheet } from 'react-native';
import { ListItem, Icon } from 'native-base';
import { connect } from 'react-redux';
import { setCognitoUser } from '../../store/actions/authActions';
import userPool from '../../AWS/cognito_config';
import App from '../../../App';

class SideDrawer extends Component {
    logOutHandler = () => {
        console.log("Before sign out: ", userPool.getCurrentUser());
        // console.log(this.props.cognitoUser.getUsername());
        // this.props.cognitoUser.signOut();
        userPool.getCurrentUser().signOut();
        console.log("After sign out: ", userPool.getCurrentUser());
        this.props.setCognitoUser(null);
        App();
    }

    render() {
        return (
            <View style={[styles.container, { width: Dimensions.get("window").width * 0.75 }]}>
                <ListItem style={styles.drawerItem} onPress={this.logOutHandler}>
                    <Icon ios="ios-log-out" android="md-log-out" style={styles.drawerIcon} />
                    <Text>登出</Text>
                </ListItem>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 35,
        backgroundColor: "#FFF",
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    drawerIcon: {
        marginRight: 10,
    }
});

const mapStateToProps = state => {
    return {
        cognitoUser: state.auth.cognitoUser
    }
}

export default connect(mapStateToProps, { setCognitoUser })(SideDrawer);
// export default SideDrawer;