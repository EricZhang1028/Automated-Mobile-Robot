import AWS from './AWS_config';
const db = new AWS.DynamoDB.DocumentClient();
export default db;