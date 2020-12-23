import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: 'ap-northeast-1_LORWUfXFi',
    ClientId: '1rfi31n8ebidhv368rs9k24a1v'
};
const userPool = new CognitoUserPool(poolData);

export default userPool;
