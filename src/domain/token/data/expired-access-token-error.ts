import { InvalidTokenError } from "./invalid-token-error";

export class ExpiredAccessTokenError extends InvalidTokenError {
    constructor(message: string = "expired access token") {
        super(message);
    }
}