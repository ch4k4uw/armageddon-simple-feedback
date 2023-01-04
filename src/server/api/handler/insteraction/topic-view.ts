import { Topic } from "../../../../domain/feedback/entity/topic";

export class TopicView {
    readonly id: string;
    readonly code: string;
    readonly title: string;
    readonly description: string;
    readonly authorName: string;
    readonly expires: number;
    readonly created: number;
    readonly updated: number;

    constructor(
        topic: Topic
    ) {
        this.id = topic.id;
        this.code = topic.code;
        this.code = topic.code;
        this.title = topic.title;
        this.title = topic.title;
        this.description = topic.description;
        this.authorName = topic.authorName;
        this.expires = topic.expires.getTime();
        this.created = topic.created.getTime();
        this.updated = topic.updated.getTime();
    }
}