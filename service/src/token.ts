'use strict';
const db = require("../lib/database");
import { pbkdf2Sync } from 'crypto';
import { Settings } from '../etc/settings';
import { getSecret } from '../lib/secret';
import { AuthToken } from '../types/AuthToken';
import {
  sign as jwtSign,
} from 'jsonwebtoken';
import {
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda';

var response: APIGatewayProxyResult = {
  statusCode: 200,
  body: "{}",
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  }
}

const jwtArn: string = process.env['IS_OFFLINE'] === 'true' ?
  'offline-key-arn' :
  (process.env['JWT_ARN'] || "");

export const post: APIGatewayProxyHandler = async (event, _context) => {

  // Parse request body; hopefully caller gave us some JSON
  var body = null;
  try {
    body = null === event || null === event.body ?
      null : JSON.parse(event.body);
  } catch (error) {
    body = null;
  }
  if (
    !body ||
    !body.user || body.user === "" ||
    !body.secret || body.secret === ""
  ) {
    response.statusCode = 400;
    response.body = 'One or more missing arguments, check payload.';
    return response;
  }

  // get user information for authentication
  var dbResult = await db.call("get", {
    TableName: process.env.USER_TABLE,
    Key: {
      'uname': body.user
    }
  });

  // verify query success
  if (
    !dbResult ||
    !dbResult.Item
  ) {
    response.statusCode = 401;
    response.body = 'Username or password errer';
    return response;
  }

  // hash provided secret and compare to DB record
  let secretHash = pbkdf2Sync(
    body.secret,
    dbResult.Item['salt'],
    Settings.pbkdf2.itterations,
    Settings.pbkdf2.length,
    Settings.pbkdf2.digest
  );

  // do they match?
  if (
    dbResult.Item['secret'] === secretHash.toString('hex')
  ) {

    // YAY! We get to issue a new token
    // Obtain JWT key
    let jwtSecret = '';
    try {
      let jwtToken = await getSecret(jwtArn);
      if (jwtToken.SecretString) {
        jwtSecret = jwtToken.SecretString
      } else {
        jwtSecret = '';
      }
    } catch (err) {
      jwtSecret = '';
    }

    // generate a new token
    let newToken = new AuthToken();
    newToken.sub = dbResult.Item.uname
    newToken.pri = dbResult.Item.pri

    let signedToken = jwtSign(
      newToken.toObject(),
      jwtSecret,
      {
        algorithm: "HS512"
      });
    response.statusCode = 200;
    response.body = JSON.stringify({
      Authorization: signedToken
    });
  } else {

    // password hashes did not match
    response.statusCode = 401;
    response.body = "Username or password error";
  }
  return response;
}
