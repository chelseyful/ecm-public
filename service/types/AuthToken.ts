import { Settings } from '../etc/settings';

export class AuthToken implements AuthTokenObject {

    /**
     * The token version implimented by this class
     */
    static version = 1

    /**
     *
     * @param sub UUID of user this token was issued to
     * @param iat The timestamp the token was issued
     * @param exp The timestamp the token expires
     * @param pri The level of privilage granted to this token 0=low 8=high
     */
    constructor(
        public sub: string = 'anonamous',
        public iat: number = Date.now(),
        public exp: number = Date.now() + Settings.token_iss_duration,
        public pri: number = 0,
        public v: number = AuthToken.version,
    ) {}

    static fromObject(
        auth: any
    ): AuthToken{
        let newToken = new AuthToken();

        // Test provided param is an object with expected props
        // Assumes the token was previously validates as part of a JWT decode
        if (
            typeof(auth) === 'object' &&
            typeof(auth.sub) === 'string' &&
            typeof(auth.iat) === 'number' &&
            typeof(auth.exp) === 'number' &&
            typeof(auth.pri) === 'number'
        ) {
            newToken.sub = auth.sub;
            newToken.iat = auth.iat;
            newToken.exp = auth.eat;
            newToken.pri = auth.pri;
        }
        return newToken;
    }

    toObject(): AuthTokenObject {
        return {
            sub: this.sub,
            iat: this.iat,
            exp: this.exp,
            pri: this.pri,
            v: this.v
        }
    }

    toJSON(): string {
        return JSON.stringify(this.toObject());
    }
}

/**
 * Expected format of the token issued to callers of this API
 */
export interface AuthTokenObject {
    /**
     * The UUID of the user account that owns this token. In the case of an
     * unknown or unathenticated user, this value is set to 'anonymous'
     */
    sub: string
    /**
     * The UNIX timestamp the token was issued
     */
    iat: number
    /**
     * The UNIX timestamp at which the token is no longer valid
     */
    exp: number
    /**
     * The level of privilage granted to bearer of this token
     */
    pri: number
    /**
     * The token version used to generate and issue this token
     */
    v: number
}
