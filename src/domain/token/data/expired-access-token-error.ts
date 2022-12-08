export class ExpiredAccessTokenError extends Error {
    constructor(message: string = "expired access token") {
        super(message);
    }
}