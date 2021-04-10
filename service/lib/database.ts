'use strict';
// source: https://github.com/AnomalyInnovations/serverless-stack-demo-api/blob/master/libs/dynamodb-lib.js

const AWS =require("aws-sdk");
module.exports.call = (action, params) => {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    AWS.config.update({region: 'us-east-1'});
    return dynamoDb[action](params).promise();
};
