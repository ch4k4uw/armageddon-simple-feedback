import { anyString, instance, mock, verify } from "ts-mockito";
import { FindTopicSummaryByIdApp } from "../../../../src/application/feedback/topic/find-topic-summary-by-id-app";
import { TopicNotFoundError } from "../../../../src/domain/feedback/data/topic-not-found-error";
import { ITopicRepository } from "../../../../src/domain/feedback/repository/topic-repository";
import { ExpiredAccessTokenError } from "../../../../src/domain/token/data/expired-access-token-error";
import { InvalidAccessTokenError } from "../../../../src/domain/token/data/invalid-access-token-error";
import { reject } from "../../../util/framework";
import { TopicFixture } from "./stuff/topic-fixture";

describe('Find topic summary by id tests', () => {
    let svc: FindTopicSummaryByIdApp;
    let topicRepository: ITopicRepository;
    beforeEach(() => {
        topicRepository = mock<ITopicRepository>();

        TopicFixture.setupTopicRepository(topicRepository);

        svc = new FindTopicSummaryByIdApp(instance(topicRepository));
    });

    test('should find the topic summary', async () => {
        const result = await svc.find(
            TopicFixture.FindSummary.successAccessToken, TopicFixture.FindSummary.successId
        );
        expect(result).toEqual({ ...TopicFixture.FindSummary.successTopic });
        verify(topicRepository.findSummary(anyString())).once();
    });

    reject('should reject with topic not found error', async () => {
        await svc.find(
            TopicFixture.FindSummary.successAccessToken, TopicFixture.FindSummary.topicNotFoundId
        );
    }, (err) => {
        expect(err).toBeInstanceOf(TopicNotFoundError);
        verify(topicRepository.findSummary(anyString())).once();
    });

    reject('should reject with invalid access token error', async () => {
        await svc.find(
            TopicFixture.FindSummary.invalidAccessToken, TopicFixture.FindSummary.successId
        );
    }, (err) => {
        expect(err).toBeInstanceOf(InvalidAccessTokenError);
        verify(topicRepository.findSummary(anyString())).never();
    });
    
    reject('should reject with expired access token error', async () => {
        await svc.find(
            TopicFixture.FindSummary.expiredAccessToken, TopicFixture.FindSummary.successId
        );
    }, (err) => {
        expect(err).toBeInstanceOf(ExpiredAccessTokenError);
        verify(topicRepository.findSummary(anyString())).never();
    });
});