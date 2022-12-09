import { InvalidTokenError } from "./invalid-token-error";

export class ExpiredRefreshTokenError extends InvalidTokenError {
    constructor(message: string = "expired refresh token") {
        super(message);
    }
}