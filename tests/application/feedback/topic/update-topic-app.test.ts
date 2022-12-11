import { anything, capture, instance, mock, verify } from "ts-mockito";
import { UpdateTopicApp } from "../../../../src/application/feedback/topic/update-topic-app";
import { ExpiredTopicError } from "../../../../src/domain/feedback/data/expired-topic-error";
import { TopicNotFoundError } from "../../../../src/domain/feedback/data/topic-not-found-error";
import { ITopicCmdRepository } from "../../../../src/domain/feedback/repository/topic-cmd-repository";
import { ExpiredAccessTokenError } from "../../../../src/domain/token/data/expired-access-token-error";
import { InvalidAccessTokenError } from "../../../../src/domain/token/data/invalid-access-token-error";
import { reject } from "../../../util/framework";
import { TopicFixture } from "./stuff/topic-fixture";

describe('Update topic tests', () => {
    let svc: UpdateTopicApp;
    let topicRepository: ITopicCmdRepository;
    beforeEach(() => {
        topicRepository = mock<ITopicCmdRepository>();

        TopicFixture.setupTopicRepository(topicRepository);

        svc = new UpdateTopicApp(instance(topicRepository));
    });

    test('should update a topic', async () => {
        const result = await svc.update(
            TopicFixture.RegisterTopic.successAccessToken, TopicFixture.UpdateTopic.successTopicUpdate
        );
        verify(topicRepository.update(anything())).once();
        const [intermediaryTopic] = capture(topicRepository.update).last();
        expect(intermediaryTopic).toEqual({ ...TopicFixture.UpdateTopic.successIntermediaryTopicUpdate });
        expect(result).toEqual({ ...TopicFixture.UpdateTopic.successTopic });
    });

    reject('should reject with invalid access token error', async () => {
        await svc.update(
            TopicFixture.RegisterTopic.invalidAccessToken, TopicFixture.UpdateTopic.successTopicUpdate
        );
    }, (err) => {
        expect(err).toBeInstanceOf(InvalidAccessTokenError);
        verify(topicRepository.update(anything())).never();
    });
    
    reject('should reject with expired access token error', async () => {
        await svc.update(
            TopicFixture.RegisterTopic.expiredAccessToken, TopicFixture.UpdateTopic.successTopicUpdate
        );
    }, (err) => {
        expect(err).toBeInstanceOf(ExpiredAccessTokenError);
        verify(topicRepository.update(anything())).never();
    });

    reject('should reject with topic expired error', async () => {
        await svc.update(
            TopicFixture.UpdateTopic.successAccessToken, TopicFixture.UpdateTopic.expiredTopicUpdate
        );
    }, (err) => {
        expect(err).toBeInstanceOf(ExpiredTopicError);
        verify(topicRepository.insert(anything())).never();
    });

    reject('should reject with topic not found error', async () => {
        await svc.update(
            TopicFixture.UpdateTopic.successAccessToken, TopicFixture.UpdateTopic.topicNotFoundUpdate
        );
    }, (err) => {
        expect(err).toBeInstanceOf(TopicNotFoundError);
        verify(topicRepository.update(anything())).once();
    });
});