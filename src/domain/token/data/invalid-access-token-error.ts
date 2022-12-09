import { InvalidTokenError } from "./invalid-token-error";

export class InvalidAccessTokenError extends InvalidTokenError {
    constructor(message: string = "invalid access token") {
        super(message);
    }
}