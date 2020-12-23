import { SET_COGNITO_USER, SET_CURRENT_USER } from "./actionTypes";

export const setCognitoUser = cognitoUser => {
    return {
        type: SET_COGNITO_USER,
        cognitoUser: cognitoUser
    }
}

export const setCurrentUser = currentUser => {
    return {
        type: SET_CURRENT_USER,
        currentUser: currentUser
    }
}