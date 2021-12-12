'use strict';
const db = require("../lib/database");
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

var response: APIGatewayProxyResult = {
  statusCode: 200,
  body: "[]",
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  }
}

export const get: APIGatewayProxyHandler = async (event, _context) => {
  const qPid = event!.pathParameters!.proxy || '';

  // Validate requested PID
  if (!(/^[0-9]{4}-[0-9]{3}$/.test(qPid))) {
    response.statusCode = 400;
    response.body = 'Provided Posting ID does not match expected format.';
    return response;
  }

  // perform query
  var dbResult = await db.call("query", {
    TableName: process.env.CODE_TABLE,
    IndexName: 'pid-index',
    KeyConditionExpression: 'pid = :hkey',
    ExpressionAttributeValues: {
      ':hkey': qPid
    }
  });

  let recordList = [];
  if (dbResult && dbResult.Items) {
    for (const item of dbResult.Items) {
      if (item.updated && item.updated > 0) {
        recordList.push({
          code: item.code,
          updated: item.updated
        });
      }
    }
    response.body = JSON.stringify(recordList);
  } else {
    response.statusCode = 500;
    response.body = 'Error when executing query';
  }
  return response;
}
