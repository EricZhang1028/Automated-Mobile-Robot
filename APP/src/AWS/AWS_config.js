const AWS = require('aws-sdk/dist/aws-sdk-react-native');
AWS.config.update({
    region: "ap-northeast-1",
    credentials: {
        accessKeyId: "AKIAIXEYLVHUU7TOKG7A",
        secretAccessKey: "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"
    }
});
//AWS.config.loadFromPath('/Users/tonychen/AWS/config.json');
export default AWS;
