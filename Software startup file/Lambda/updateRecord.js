var AWS = require('aws-sdk');
AWS.config.update({region:'ap-northeast-1'});
var ddb = new AWS.DynamoDB.DocumentClient({apiVersion: "2012-08-10"});

exports.handler = (event, context, callback) => {
    var recordArray = event.record
    for(var i = 0; i < recordArray.length; i++){
        var re = recordArray[i];
        var params = {
            TableName: "Record",
            Item: re
        }
        ddb.put(params, (err, data) => {
            console.log(data != null ? "Reset record success!" : "Reset record fail...");
        })
    }
    // TODO implement
    const response = {
        statusCode: 200,
        body: "Hello Lambda"
    };
    callback(null, response);
};