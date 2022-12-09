export class InvalidTokenError extends Error {
    constructor(message: string = "invalid token") {
        super(message);
    }
}