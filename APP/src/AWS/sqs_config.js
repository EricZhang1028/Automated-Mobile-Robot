import AWS from './AWS_config';
const sqs = new AWS.SQS({
    apiVersion: '2012-11-05',
    region: 'ap-northeast-1'
});
export default sqs;