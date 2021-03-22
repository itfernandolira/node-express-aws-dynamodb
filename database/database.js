var AWS = require("aws-sdk");
AWS.config.update({region:'eu-west-2'});

AWS.config.update({endpoint: "https://dynamodb.eu-west-2.amazonaws.com"});

var dynamodb = new AWS.DynamoDB();

module.exports=dynamodb;