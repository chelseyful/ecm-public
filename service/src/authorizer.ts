'use strict';
import {
    AuthPolicy,
    ApiOptions,
    HttpVerb
} from '../lib/AuthPolicy';
import {
    APIGatewayTokenAuthorizerHandler,
    APIGatewayAuthorizerResult
} from 'aws-lambda';
import { AuthToken } from '../types/AuthToken';
import { getSecret } from '../lib/secret';
import { Settings } from '../etc/settings';

import {
    verify as jwtVerify
} from 'jsonwebtoken';
interface endpointElement {
    path: string,
    method: HttpVerb,
    privilage: number,
}

// Should not store these in code...
// TODO: make these dynamic (query based?)
const endpoints: endpointElement[] = [
    {
        path: '/echo',
        method: HttpVerb.ALL,
        privilage: 1,
    },
    {
        path: '/code',
        method: HttpVerb.GET,
        privilage: 1,
    },
    {
        path: '/code/*',
        method: HttpVerb.DELETE,
        privilage: 99,
    },
    {
        path: '/code',
        method: HttpVerb.POST,
        privilage: 0,
    },
    {
        path: '/pid',
        method: HttpVerb.GET,
        privilage: 0,
    },
    {
        path: '/token',
        method: HttpVerb.POST,
        privilage: 0,
    },
]

const jwtArn = process.env['IS_OFFLINE'] === 'true' ?
    'arn:aws:secretsmanager:us-east-1:410734219022:secret:extra-credit-machine-dev-jwt-DvSsxv' :
    process.env['JWT_ARN'];
var jwtSecret = "";

export const handler: APIGatewayTokenAuthorizerHandler = async (event, _context) => {

    // Pull token from header (may be null/malformed/tampered)
    let callerToken = '';
    try {
        callerToken = event.authorizationToken;
    } catch (err) {
        callerToken = '';
    }

    // Strip out Bearer prefix so we are left with raw JWT
    if (callerToken &&
        typeof (callerToken) === 'string' &&
        Settings.token_validator.test(callerToken)
    ) {
        let parsedToken = Settings.token_validator.exec(callerToken);
        callerToken = parsedToken && parsedToken[1] ?
            parsedToken[1] : '';
    } else {
        callerToken = '';
    }

    // Obtain JWT key
    // ... only if token appears to be balid (save money on bad requests!)
    if (typeof (callerToken) === "string") {
        try {
            let jwtToken = jwtArn ?
                await getSecret(jwtArn) : null;
            if (jwtToken!.SecretString) {
                jwtSecret = jwtToken!.SecretString
            } else {
                jwtSecret = '';
            }
        } catch (err) {
            jwtSecret = '';
        }
    }

    // validate and deserialize token; assume JWT
    let jwtObject = {};
    if (
        callerToken &&
        typeof (callerToken) === 'string' &&
        jwtSecret != ''
    ) {
        try {
            jwtObject = jwtVerify(callerToken, jwtSecret);
        } catch (err) {
            jwtObject = {};
            console.log(err);
        }
    }

    // Process the decoded data into an AuthToken
    let userData = AuthToken.fromObject(jwtObject);

    // TODO: Check issued at and expires at timestamps

    // Deconstruct local ARN to feed policy document
    var tmp = event.methodArn.split(':');
    var apiGatewayArnTmp = tmp[5].split('/');
    var awsAccountId = tmp[4];
    var apiOptions: ApiOptions = {
        region: tmp[3],
        restApiId: apiGatewayArnTmp[0],
        stage: apiGatewayArnTmp[1]
    };
    /*
    var method = apiGatewayArnTmp[2];
    var resource = '/'; // root resource
    if (apiGatewayArnTmp[3]) {
        resource += apiGatewayArnTmp.slice(3, apiGatewayArnTmp.length).join('/');
    }
    */
    var policy = new AuthPolicy(userData.sub, awsAccountId, apiOptions);

    // Build policy document based on privilage level
    for (const ep of endpoints) {
        if (ep.privilage <= userData.pri) {
            policy.allowMethod(ep.method, ep.path);
        } else {
            policy.denyMethod(ep.method, ep.path);
        }
    }
    let res: APIGatewayAuthorizerResult = policy.build();
    if (process.env['IS_OFFLINE']) console.log(res.policyDocument.Statement);
    return res;
}
