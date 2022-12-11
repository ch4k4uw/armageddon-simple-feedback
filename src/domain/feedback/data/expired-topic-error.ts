export class ExpiredTopicError extends Error {
    constructor() {
        super("topic expired");
    }
}