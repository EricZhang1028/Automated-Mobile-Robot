import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: '',
    ClientId: ''
};
const userPool = new CognitoUserPool(poolData);

export default userPool;
