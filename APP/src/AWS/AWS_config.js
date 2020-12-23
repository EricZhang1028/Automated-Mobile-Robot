const AWS = require('aws-sdk/dist/aws-sdk-react-native');
AWS.config.update({
    region: "ap-northeast-1",
    credentials: {
        accessKeyId: "",
        secretAccessKey: ""
    }
});
//AWS.config.loadFromPath('/Users/tonychen/AWS/config.json');
export default AWS;
