export class InvalidRefreshTokenError extends Error {
    constructor(message: string = "invalid refresh token") {
        super(message);
    }
}