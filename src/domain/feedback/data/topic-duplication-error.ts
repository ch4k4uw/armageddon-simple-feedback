export class TopicDuplicationError extends Error {
    constructor() {
        super("topic already exists");
    }
}