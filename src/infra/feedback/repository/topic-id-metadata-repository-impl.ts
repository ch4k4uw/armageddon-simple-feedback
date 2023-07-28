import { Inject } from "typedi";
import { TopicNotFoundError } from "../../../domain/feedback/data/topic-not-found-error";
import { Topic } from "../../../domain/feedback/entity/topic";
import { TopicIdMetadata } from "../../../domain/feedback/entity/topic-id-metadata";
import { ITopicIdMetadataRepository } from "../../../domain/feedback/repository/topic-id-metadata-repository";
import { ITopicRepository } from "../../../domain/feedback/repository/topic-repository";
import { IoCId } from "../../../ioc/ioc-id";
import { IJwTokenService } from "../../token/service/jw-token-service";
import { JwTopicIdMetadataPayloadModel } from "../../token/service/model/jw-topic-id-metadata-payload-model";

export class TopicIdMetadataRepositoryImpl implements ITopicIdMetadataRepository {
    constructor(
        @Inject(IoCId.Infra.JW_TOKEN_SVC)
        private tokenService: IJwTokenService,
        @Inject(IoCId.Infra.TOPIC_REPOSITORY)
        private topicRepository: ITopicRepository,
    ) { }

    async findByTopicCode(code: string): Promise<TopicIdMetadata> {
        const topic = await this.topicRepository.findByCode(code);
        if (topic === Topic.empty) {
            throw new TopicNotFoundError();
        }
        const metadata = await this.tokenService.createTopicIdMetadataToken(new JwTopicIdMetadataPayloadModel(topic.code));
        return new TopicIdMetadata(topic, metadata);
    }

    async findByTopicIdMetadata(metadata: string): Promise<TopicIdMetadata> {
        const metadataModel = await this.tokenService.verifyTopicIdMetadataToken(metadata);
        const topic = await this.topicRepository.findByCode(metadataModel.code);
        if (topic === Topic.empty) {
            throw new TopicNotFoundError();
        }
        return new TopicIdMetadata(topic, metadata);
    }
}