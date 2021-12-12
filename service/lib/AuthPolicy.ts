/*
 *  Adapted from a non-TS sample blueprint from;
 *  https://github.com/awslabs/aws-apigateway-lambda-authorizer-blueprints
 */
import { PolicyDocument } from 'aws-lambda';
export class AuthPolicy {

    /**
     * The policy version used for the evaluation. This should always be "2012-10-17"
     */
    static version = "2012-10-17"

    /**
     * The regular expression used to validate resource paths for the policy
     */
    static pathRegex = new RegExp('^[/.a-zA-Z0-9-\*]+$')

    private allowMethods: ApiMethod[] = []
    private denyMethods: ApiMethod[] = []
    private restApiId: string
    private region: string
    private stage: string

    /**
     *
     * @param principalId The principal used for the policy, this should be a unique identifier for the end user.
     * @param awsAccountId The AWS account id the policy will be generated for. This is used to create the method ARNs.
     * @param apiOptions
     */
    constructor(
        public principalId: string,
        public awsAccountId: string,
        public apiOptions: ApiOptions = {}
    ) {

        if (!apiOptions || !apiOptions.restApiId) {
            this.restApiId = "*";
        } else {
            this.restApiId = apiOptions.restApiId;
        }
        if (!apiOptions || !apiOptions.region) {
            this.region = "*";
        } else {
            this.region = apiOptions.region;
        }
        if (!apiOptions || !apiOptions.stage) {
            this.stage = "*";
        } else {
            this.stage = apiOptions.stage;
        }
    }

    /**
   * Adds a method to the internal lists of allowed or denied methods. Each object in
   * the internal list contains a resource ARN and a condition statement. The condition
   * statement can be null.
   *
     * @param effect The effect for the policy. This can only be "Allow" or "Deny".
     * @param verb The HTTP verb for the method, this should ideally come from the AuthPolicy.HttpVerb object to avoid spelling mistakes
     * @param resource The resource path. For example "/pets"
     * @param conditions The conditions object in the format specified by the AWS docs.
     */
    addMethod(
        effect: PolicyEffect,
        verb: HttpVerb,
        resource: string,
        conditions: any
    ): void {

        if (!AuthPolicy.pathRegex.test(resource)) {
            throw new Error(`Invalid resource path: ${resource}. Path should match ${AuthPolicy.pathRegex}`);
        }

        var cleanedResource = resource;
        if (resource.substring(0, 1) == "/") {
            cleanedResource = resource.substring(1, resource.length);
        }
        var resourceArn =
            `arn:aws:execute-api:${this.region}:${this.awsAccountId}:${this.restApiId}/${this.stage}/${verb}/${cleanedResource}`;

        if (effect === PolicyEffect.allow) {
            this.allowMethods.push({
                resourceArn: resourceArn,
                conditions: conditions
            });
        } else {
            this.denyMethods.push({
                resourceArn: resourceArn,
                conditions: conditions
            });
        }
    }

    /**
     * Returns an empty statement object prepopulated with the correct action and the desired effect.
     * @param effect The effect of the statement, this can be "Allow" or "Deny"
     */
    getEmptyStatement(
        effect: PolicyEffect
    ): PolicyStatement {
        var statement: PolicyStatement = {
            Action: "execute-api:Invoke",
            Effect: effect,
            Resource: []
        };
        return statement;
    }

    /**
       * This function loops over an array of objects containing a resourceArn and
       * conditions statement and generates the array of statements for the policy.
       *
     * @param effect
     * @param methods
     */
    getStatementsForEffect(
        effect: PolicyEffect
    ): PolicyStatement[] {
        let statements: PolicyStatement[] = [];
        let methods: ApiMethod[] = effect === PolicyEffect.allow ?
            this.allowMethods :
            this.denyMethods;

        let uniStatement: PolicyStatement = this.getEmptyStatement(effect);
        for (const method of methods) {

            if (method.conditions === null) {
                uniStatement.Resource.push(method.resourceArn);
            } else {
                let conditionalStatement = this.getEmptyStatement(effect);
                conditionalStatement.Condition = method.conditions;
                statements.push(conditionalStatement);
            }
        }

        if (uniStatement.Resource !== null && uniStatement.Resource.length > 0) {
            statements.push(uniStatement);
        }
        return statements;
    }

    /**
         * Adds an allow "*" statement to the policy.
         *
     */
    allowAllMethods(): void {
        this.addMethod(PolicyEffect.allow, HttpVerb.ALL, "*", null);
    }

    /**
         * Adds a deny "*" statement to the policy.
         *
     */
    denyAllMethods(): void {
        this.addMethod(PolicyEffect.deny, HttpVerb.ALL, "*", null);
    }

    /**
     *
     * @param verb HTTP Method to allow
     * @param resource The resource path. For example "/pets"
     */
    allowMethod(
        verb: HttpVerb,
        resource: string
    ): void {
        this.addMethod(PolicyEffect.allow, verb, resource, null);
    }

    denyMethod(
        verb: HttpVerb,
        resource: string
    ): void {
        this.addMethod(PolicyEffect.deny, verb, resource, null);
    }

    /**
     * Adds an API Gateway method (Http verb + Resource path) to the list of allowed
     * methods and includes a condition for the policy statement. More on AWS policy
     * conditions here: http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html#Condition
     *
     * @param verb
     * @param resource
     * @param conditions
     */
    allowMethodWithConditions(
        verb: HttpVerb,
        resource: string,
        conditions: any
    ): void {
        this.addMethod(PolicyEffect.allow, verb, resource, conditions);
    }

    denyMethodWithConditions(
        verb: HttpVerb,
        resource: string,
        conditions: any
    ): void {
        this.addMethod(PolicyEffect.deny, verb, resource, conditions);
    }

    /**
     * Generates the policy document based on the internal lists of allowed and denied
     * conditions. This will generate a policy with two main statements for the effect:
     * one statement for Allow and one statement for Deny.
     * Methods that includes conditions will have their own statement in the policy.
     */
    build(): PolicyObject {
        if ((!this.allowMethods || this.allowMethods.length === 0) &&
            (!this.denyMethods || this.denyMethods.length === 0)) {
            throw new Error("No statements defined for the policy");
        }

        var policy: PolicyObject = {
            principalId: this.principalId,
            policyDocument: {
                Version: AuthPolicy.version,
                Statement: []
            }
        }

        policy.policyDocument.Statement = this.getStatementsForEffect(
            PolicyEffect.allow
        );
        policy.policyDocument.Statement = policy.policyDocument.Statement.concat(
            this.getStatementsForEffect(
                PolicyEffect.deny
            )
        );
        return policy;
    }
}

export enum PolicyEffect {
    allow = "Allow",
    deny = 'Deny'
}

/**
 * A set of existing HTTP verbs supported by API Gateway. This property is here
 * only to avoid spelling mistakes in the policy.
 */
export enum HttpVerb {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    HEAD = "HEAD",
    DELETE = "DELETE",
    OPTIONS = "OPTIONS",
    ALL = "*"
}

export interface PolicyStatement {
    Action: string
    Effect: PolicyEffect
    Resource: Array<string>
    Condition?: any
}

export interface ApiOptions {
    restApiId?: string,
    region?: string,
    stage?: string
}

export interface ApiMethod {
    resourceArn: string,
    conditions?: object
}

export interface PolicyObject {
    principalId: string,
    policyDocument: PolicyDocument
}
