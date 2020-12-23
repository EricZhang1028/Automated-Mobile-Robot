import { SET_COGNITO_USER, SET_CURRENT_USER } from '../actions/actionTypes';

const initialState = {
    cognitoUser: null,
    currentUser: null
}

const reducer = (state = initialState, action) => {
    console.log('action in reducer: ', action.type, '\n', action.cognitoUser);
    switch (action.type) {
        case SET_COGNITO_USER:
            return {
                ...state,
                cognitoUser: action.cognitoUser
            }
        case SET_CURRENT_USER:
            return {
                ...state,
                currentUser: action.currentUser
            }
        default:
            return state;
    }
}

export default reducer;