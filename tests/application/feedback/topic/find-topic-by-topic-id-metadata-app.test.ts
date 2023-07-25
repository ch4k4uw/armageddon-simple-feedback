import { anyString, instance, mock, verify } from "ts-mockito";
import { FindTopicByTopicIdMetadataApp } from "../../../../src/application/feedback/topic/find-topic-by-topic-id-metadata-app";
import { TopicNotFoundError } from "../../../../src/domain/feedback/data/topic-not-found-error";
import { ITopicIdMetadataRepository } from "../../../../src/domain/feedback/repository/topic-id-metadata-repository";
import { reject } from "../../../util/framework";
import { TopicIdMetadataFixture } from "./stuff/topic-id-metadata-fixture";

describe('Find topic id metadata by topic code tests', () => {
    let svc: FindTopicByTopicIdMetadataApp;
    let repo: ITopicIdMetadataRepository;

    beforeEach(() => {
        repo = mock<ITopicIdMetadataRepository>();

        TopicIdMetadataFixture.setupTopicIdMetadataRepository(repo);

        svc = new FindTopicByTopicIdMetadataApp(instance(repo));
    });

    test('should find a topic', async () => {
        const result = await svc.find(TopicIdMetadataFixture.FindByTopicIdMetadata.successTopicIdMetadata);
        expect(result).toEqual({ ...TopicIdMetadataFixture.FindByTopicIdMetadata.successTopic.topic });
        verify(repo.findByTopicIdMetadata(anyString())).once();
    });

    reject('should reject with topic not found error', async () => {
        await svc.find(TopicIdMetadataFixture.FindByTopicIdMetadata.topicIdMetadataNotFound);
    }, (err) => {
        expect(err).toBeInstanceOf(TopicNotFoundError);
        verify(repo.findByTopicIdMetadata(anyString())).once();
    });
});