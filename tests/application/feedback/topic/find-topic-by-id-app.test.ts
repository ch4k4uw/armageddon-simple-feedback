import { anyString, instance, mock, verify } from "ts-mockito";
import { FindTopicByIdApp } from "../../../../src/application/feedback/topic/find-topic-by-id-app";
import { TopicNotFoundError } from "../../../../src/domain/feedback/data/topic-not-found-error";
import { ITopicRepository } from "../../../../src/domain/feedback/repository/topic-repository";
import { ExpiredAccessTokenError } from "../../../../src/domain/token/data/expired-access-token-error";
import { InvalidAccessTokenError } from "../../../../src/domain/token/data/invalid-access-token-error";
import { reject } from "../../../util/framework";
import { TopicFixture } from "./stuff/topic-fixture";

describe('Find topic by id tests', () => {
    let svc: FindTopicByIdApp;
    let topicRepository: ITopicRepository;

    beforeEach(() => {
        topicRepository = mock<ITopicRepository>();

        TopicFixture.setupTopicRepository(topicRepository);

        svc = new FindTopicByIdApp(instance(topicRepository));
    });

    test('should find a topic', async () => {
        const result = await svc.find(
            TopicFixture.FindById.successAccessToken, TopicFixture.FindById.successId
        );
        expect(result).toEqual({ ...TopicFixture.FindById.successTopic });
        verify(topicRepository.findById(anyString())).once();
    });

    reject('should reject with topic not found error', async () => { 
        await svc.find(
            TopicFixture.FindById.successAccessToken, TopicFixture.FindById.topicNotFoundId
        );
    }, (err) => {
        expect(err).toBeInstanceOf(TopicNotFoundError);
        verify(topicRepository.findById(anyString())).once();
    });

    reject('should reject with invalid access token error', async () => { 
        await svc.find(
            TopicFixture.FindById.invalidAccessToken, TopicFixture.FindById.successId
        );
    }, (err) => {
        expect(err).toBeInstanceOf(InvalidAccessTokenError);
        verify(topicRepository.findById(anyString())).never();
    });

    reject('should reject with expired access token error', async () => { 
        await svc.find(
            TopicFixture.FindById.expiredAccessToken, TopicFixture.FindById.successId
        );
    }, (err) => {
        expect(err).toBeInstanceOf(ExpiredAccessTokenError);
        verify(topicRepository.findById(anyString())).never();
    });
});