export class FeedbackNotFoundError extends Error {
    constructor() {
        super("feedback not found");
    }
}