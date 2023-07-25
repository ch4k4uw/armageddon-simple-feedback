import { TopicIdMetadata } from "../entity/topic-id-metadata";

export interface ITopicIdMetadataRepository {
    findByTopicCode(code: string): Promise<TopicIdMetadata>;
    findByTopicIdMetadata(metadata: string): Promise<TopicIdMetadata>;
}