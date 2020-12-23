import AWS from './AWS_config';
const s3_bucket = new AWS.S3({
    params: {Bucket: 'im3514project'} 
});
export default s3_bucket;