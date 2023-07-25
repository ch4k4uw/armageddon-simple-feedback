import { anyString, instance, mock, verify } from "ts-mockito";
import { FindTopicIdMetadataByTopicCodeApp } from "../../../../src/application/feedback/topic/find-topic-id-metadata-by-topic-code-app";
import { TopicNotFoundError } from "../../../../src/domain/feedback/data/topic-not-found-error";
import { ITopicIdMetadataRepository } from "../../../../src/domain/feedback/repository/topic-id-metadata-repository";
import { ExpiredAccessTokenError } from "../../../../src/domain/token/data/expired-access-token-error";
import { InvalidAccessTokenError } from "../../../../src/domain/token/data/invalid-access-token-error";
import { reject } from "../../../util/framework";
import { TopicIdMetadataFixture } from "./stuff/topic-id-metadata-fixture";

describe('Find topic id metadata by topic code tests', () => {
    let svc: FindTopicIdMetadataByTopicCodeApp;
    let repo: ITopicIdMetadataRepository;

    beforeEach(() => {
        repo = mock<ITopicIdMetadataRepository>();

        TopicIdMetadataFixture.setupTopicIdMetadataRepository(repo);

        svc = new FindTopicIdMetadataByTopicCodeApp(instance(repo));
    });

    test('should find a topic', async () => {
        const result = await svc.find(TopicIdMetadataFixture.FindByTopicCode.successAccessToken, TopicIdMetadataFixture.FindByTopicCode.successCode);
        expect(result).toEqual({ ...TopicIdMetadataFixture.FindByTopicCode.successTopicIdMetadata });
        verify(repo.findByTopicCode(anyString())).once();
    });

    reject('should reject with topic not found error', async () => {
        await svc.find(TopicIdMetadataFixture.FindByTopicCode.successAccessToken, TopicIdMetadataFixture.FindByTopicCode.topicNotFoundCode);
    }, (err) => {
        expect(err).toBeInstanceOf(TopicNotFoundError);
        verify(repo.findByTopicCode(anyString())).once();
    });

    reject('should reject with invalid access token error', async () => { 
        await svc.find(
            TopicIdMetadataFixture.FindByTopicCode.invalidAccessToken, TopicIdMetadataFixture.FindByTopicCode.successCode
        );
    }, (err) => {
        expect(err).toBeInstanceOf(InvalidAccessTokenError);
        verify(repo.findByTopicCode(anyString())).never();
    });

    reject('should reject with expired access token error', async () => { 
        await svc.find(
            TopicIdMetadataFixture.FindByTopicCode.expiredAccessToken, TopicIdMetadataFixture.FindByTopicCode.successCode
        );
    }, (err) => {
        expect(err).toBeInstanceOf(ExpiredAccessTokenError);
        verify(repo.findByTopicCode(anyString())).never();
    });
});