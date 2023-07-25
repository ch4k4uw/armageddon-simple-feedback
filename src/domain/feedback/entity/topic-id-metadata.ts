import { Topic } from "./topic";

export class TopicIdMetadata {
    constructor(
        readonly topic: Topic,
        readonly metadata: string,
    ) { }

    get id() { 
        return this.topic.id;
    }

    static readonly empty = new TopicIdMetadata(Topic.empty, "");
}