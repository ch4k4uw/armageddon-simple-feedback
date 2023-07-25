import { TopicIdMetadata } from "../../../../domain/feedback/entity/topic-id-metadata";
import { TopicView } from "./topic-view";

export class TopicIdMetadataView {
    readonly id: string;
    readonly topic: TopicView;
    readonly metadata: string;

    constructor(topicIdMetadata: TopicIdMetadata) {
        this.id = topicIdMetadata.id;
        this.topic = new TopicView(topicIdMetadata.topic);
        this.metadata = topicIdMetadata.metadata;
    }
}