import { anyNumber, anyString, anything, mock, when } from "ts-mockito";
import { TopicIdMetadata } from "../../../../../src/domain/feedback/entity/topic-id-metadata";
import { CommonFeedbackFixture } from "../../stuff/common-feedback-fixture";
import { ITopicRepository } from "../../../../../src/domain/feedback/repository/topic-repository";
import { Topic } from "../../../../../src/domain/feedback/entity/topic";
import { IJwTokenService } from "../../../../../src/infra/token/service/jw-token-service";
import { JwTopicIdMetadataPayloadModel } from "../../../../../src/infra/token/service/model/jw-topic-id-metadata-payload-model";

export namespace TopicIdMetadataFixture {
    export namespace FindByCode {
        export class Success {
            private constructor() { }
            static get topicIdMetadataPayloadModel() {
                return new JwTopicIdMetadataPayloadModel(this.topicIdMetadataDomain.topic.code);
            }

            static get topicIdMetadataDomain() {
                return new TopicIdMetadata(
                    CommonFeedbackFixture.Common.topic1.asDomain,
                    this.idMetadata,
                );
            }

            static get idMetadata() {
                return "xyz1";
            }
        }

        export class NotFound {
            private constructor() { }
            static get topicIdMetadataDomain() {
                return new TopicIdMetadata(
                    CommonFeedbackFixture.Common.topic2.asDomain,
                    Success.idMetadata + "2",
                );
            }
        }
    }
    
    export namespace FindByTopicIdMetadata {
        export class Success {
            private constructor() { }
            static get topicIdMetadataPayloadModel() {
                return new JwTopicIdMetadataPayloadModel(this.topicIdMetadataDomain.topic.code);
            }

            static get topicIdMetadataDomain() {
                return new TopicIdMetadata(
                    CommonFeedbackFixture.Common.topic3.asDomain,
                    this.idMetadata,
                );
            }

            static get idMetadata() {
                return "xyz2";
            }
        }

        export class NotFound {
            private constructor() { }
            static get topicIdMetadataPayloadModel() {
                return new JwTopicIdMetadataPayloadModel(this.topicIdMetadataDomain.topic.code);
            }
            
            static get topicIdMetadataDomain() {
                return new TopicIdMetadata(
                    CommonFeedbackFixture.Common.topic4.asDomain,
                    this.idMetadata,
                );
            }

            static get idMetadata() {
                return Success.idMetadata + "2";
            }
        }
    }

    export function createTopicRepositoryMock() {
        const repository = mock<ITopicRepository>();

        when(repository.findByCode(FindByCode.Success.topicIdMetadataDomain.topic.code)).thenResolve(
            FindByCode.Success.topicIdMetadataDomain.topic
        );
        when(repository.findByCode(FindByCode.NotFound.topicIdMetadataDomain.topic.code)).thenResolve(Topic.empty);

        when(repository.findByCode(FindByTopicIdMetadata.Success.topicIdMetadataDomain.topic.code)).thenResolve(
            FindByTopicIdMetadata.Success.topicIdMetadataDomain.topic
        );
        when(repository.findByCode(FindByTopicIdMetadata.NotFound.topicIdMetadataDomain.topic.code)).thenResolve(Topic.empty);

        return repository;
    }

    export function createJwTokenServiceMock() {
        const service = mock<IJwTokenService>();

        when(service.createTopicIdMetadataToken(anything())).thenCall(async (...args: any[]) => {
            const arg = args[0] as JwTopicIdMetadataPayloadModel;
            if (arg.code == FindByCode.Success.topicIdMetadataPayloadModel.code) {
                return FindByCode.Success.idMetadata;
            }
            return null;
        });
        when(service.verifyTopicIdMetadataToken(FindByTopicIdMetadata.Success.idMetadata)).thenResolve(FindByTopicIdMetadata.Success.topicIdMetadataPayloadModel);
        when(service.verifyTopicIdMetadataToken(FindByTopicIdMetadata.NotFound.idMetadata)).thenResolve(FindByTopicIdMetadata.NotFound.topicIdMetadataPayloadModel);

        return service;
    }
}