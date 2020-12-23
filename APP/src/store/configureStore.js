import { createStore, combineReducers, compose, applyMiddleware } from "redux";
// import thunk from "redux-thunk";

import authReducer from './reducers/authReducer';

const rootReducer = combineReducers({
    auth: authReducer
})

// let composeEnhancers = compose;

// if (__DEV__) {
//   composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// }

const configureStore = () => {
  return createStore(rootReducer);
};

export default configureStore;