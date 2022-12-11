import { anyString, instance, mock, verify } from "ts-mockito";
import { RemoveTopicApp } from "../../../../src/application/feedback/topic/remove-topic-app";
import { TopicNotFoundError } from "../../../../src/domain/feedback/data/topic-not-found-error";
import { ITopicCmdRepository } from "../../../../src/domain/feedback/repository/topic-cmd-repository";
import { ExpiredAccessTokenError } from "../../../../src/domain/token/data/expired-access-token-error";
import { InvalidAccessTokenError } from "../../../../src/domain/token/data/invalid-access-token-error";
import { reject } from "../../../util/framework";
import { TopicFixture } from "./stuff/topic-fixture";

describe('Remove topic tests', () => {
    let svc: RemoveTopicApp;
    let topicRepository: ITopicCmdRepository;

    beforeEach(() => {
        topicRepository = mock<ITopicCmdRepository>();

        TopicFixture.setupTopicRepository(topicRepository);

        svc = new RemoveTopicApp(instance(topicRepository));
    });

    test('should remove a topic', async () => {
        const result = await svc.remove(
            TopicFixture.RemoveTopic.successAccessToken, TopicFixture.RemoveTopic.successTopicRemovalId
        );
        verify(topicRepository.delete(anyString())).once();
        expect(result).toEqual({ ...TopicFixture.RemoveTopic.successTopic });
    });

    reject('should reject with invalid access token error', async () => {
        await svc.remove(
            TopicFixture.RemoveTopic.invalidAccessToken, TopicFixture.RemoveTopic.successTopicRemovalId
        );
    }, (err) => {
        expect(err).toBeInstanceOf(InvalidAccessTokenError);
        verify(topicRepository.delete(anyString())).never();
    });
    
    reject('should reject with expired access token error', async () => {
        await svc.remove(
            TopicFixture.RemoveTopic.expiredAccessToken, TopicFixture.RemoveTopic.successTopicRemovalId
        );
    }, (err) => {
        expect(err).toBeInstanceOf(ExpiredAccessTokenError);
        verify(topicRepository.delete(anyString())).never();
    });

    reject('should reject with topic not found error', async () => {
        await svc.remove(
            TopicFixture.RemoveTopic.successAccessToken, TopicFixture.RemoveTopic.topicNotFoundRemovalId
        );
    }, (err) => {
        expect(err).toBeInstanceOf(TopicNotFoundError);
        verify(topicRepository.delete(anyString())).once();
    });
});