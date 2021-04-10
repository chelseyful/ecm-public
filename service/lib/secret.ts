import { AWSError, SecretsManager } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';

export function getSecret(secretName: string): Promise<PromiseResult<SecretsManager.GetSecretValueResponse, AWSError>> {
    var client = new SecretsManager();
    return client.getSecretValue({SecretId: secretName}).promise();
};
