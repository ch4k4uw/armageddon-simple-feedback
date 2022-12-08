export class ExpiredRefreshTokenError extends Error {
    constructor(message: string = "expired refresh token") {
        super(message);
    }
}