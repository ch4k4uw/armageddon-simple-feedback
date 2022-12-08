export class InvalidAccessTokenError extends Error {
    constructor(message: string = "invalid access token") {
        super(message);
    }
}