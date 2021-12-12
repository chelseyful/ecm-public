'use strict';
const db = require("../lib/database");
import { v4 as uuidv4 } from 'uuid';
import { random as cryptoRandomString } from '@supercharge/strings';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

var response: APIGatewayProxyResult = {
  statusCode: 200,
  body: "{}",
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  }
}

export const get: APIGatewayProxyHandler = async (event, _context) => {
  let newCode = {
    'uuid': uuidv4() + '',
    'code': '',
    'pid': '0000-000',
    'created': Date.now(),
    'updated': 0,
    'active': true
  };

  // Generate a new code
  //let code = cryptoRandomString({ length: 16, type: 'alphanumeric' });
  let code = cryptoRandomString(16);
  code = code.toUpperCase();
  let codeParts = /.{8}.{8}/.exec(code);
  if (codeParts && codeParts[1] && codeParts[1]) {
    code = codeParts[1] + '-' + codeParts[2];
  }
  newCode.code = code;


  // Write new record to database
  var dbResult = null;
  if (process.env.STAGE !== 'local') {
    dbResult = await db.call("put",
      {
        TableName: process.env.CODE_TABLE,
        Item: newCode
      }
    );
  } else {
    dbResult = true;
  }

  if (dbResult) {
    // everything worked!
    response.statusCode = 200;
    response.body = JSON.stringify({
      'uuid': uuidv4() + '',
      'code': newCode.code,
      'created': newCode.created
    });
  } else {
    // database broke
    response.statusCode = 500;
    response.body = "Could not write to database";
  }
  return response;
}

export const remove: APIGatewayProxyHandler = async (event, _context) => {
  const qCode = null === event.pathParameters ?
    '' : event.pathParameters.code || '';

  // return error if UUID invalid
  if (!(/^[A-Z0-9]{8}-[A-Z0-9]{8}$/.test(qCode))) {
    response.statusCode = 400;
    response.body = '{"error":"provided code format was invalid"}';
    return response;
  }

  let dbResult = await db.call("delete",
    {
      TableName: process.env.CODE_TABLE,
      Key: {
        code: qCode
      }
    }
  );
  console.log(dbResult);
  return response;
}

export const post: APIGatewayProxyHandler = async (event, _context) => {

  var body = null;
  try {
    if (event && event.body) body = JSON.parse(event.body);
  } catch (error) {
    body = null;
  }
  if (
    !body ||
    !body.code ||
    !body.pid
  ) {
    response.statusCode = 400;
    response.body = 'One or more missing arguments, check payload.';
    return response;
  }

  // RegEx match code field
  body.code = body.code.toUpperCase();
  if (!(/^[A-Z0-9]{8}-[A-Z0-9]{8}$/.test(body.code))) {
    response.statusCode = 400;
    response.body = 'Provided code does not match expected format.';
    return response;
  }

  // Validate posting ID
  if (!(/^[0-9]{4}-[0-9]{3}$/.test(body.pid))) {
    response.statusCode = 400;
    response.body = 'Provided Posting ID does not match expected format.';
    return response;
  }

  // Verify code has not already been claimed
  var dbResult = await db.call("get", {
    TableName: process.env.CODE_TABLE,
    Key: {
      'code': body.code
    }
  });

  // verify query success
  if (
    !dbResult ||
    !dbResult.Item
  ) {
    response.statusCode = 404;
    response.body = 'Requested code does not exist in database.';
    return response;
  }

  // Check code not already used
  if (!dbResult.Item.active) {
    response.statusCode = 403;
    response.body = 'The requested code has already been claimed';
    return response;
  }

  // If we have gotten this far, claim the code
  await db.call("update", {
    TableName: process.env.CODE_TABLE,
    Key: {
      'code': body.code
    },
    UpdateExpression: "SET active = :newactive, pid = :newpid, updated = :newupdated",
    ExpressionAttributeValues: {
      ':newpid': body.pid,
      ':newupdated': Date.now(),
      ':newactive': false
    }
  });

  response.statusCode = 200;
  response.body = JSON.stringify({ 'uuid': dbResult.Item.uuid });
  return response;
}
