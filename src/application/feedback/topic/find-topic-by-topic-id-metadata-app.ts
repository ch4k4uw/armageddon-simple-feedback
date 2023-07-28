import { Inject, Service } from "typedi";
import { Topic } from "../../../domain/feedback/entity/topic";
import { ITopicIdMetadataRepository } from "../../../domain/feedback/repository/topic-id-metadata-repository";
import { IoCId } from "../../../ioc/ioc-id";

@Service()
export class FindTopicByTopicIdMetadataApp {
    constructor(
        @Inject(IoCId.Infra.TOPIC_ID_METADATA_REPOSITORY)
        private repository: ITopicIdMetadataRepository,
    ) { }

    async find(metadata: string): Promise<Topic> {
        const result = await this.repository.findByTopicIdMetadata(metadata);
        return result.topic;
    }
}