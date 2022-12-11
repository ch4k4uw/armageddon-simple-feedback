export class TopicNotFoundError extends Error {
    constructor() {
        super("topic not found");
    }
}