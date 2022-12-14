import { InvalidTokenError } from "./invalid-token-error";

export class InvalidRefreshTokenError extends InvalidTokenError {
    constructor(message: string = "invalid refresh token", cause?: Error) {
        super((cause || {}).message || message);
    }
}