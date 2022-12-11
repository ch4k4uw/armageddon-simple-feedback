import { anyNumber, anyString, instance, mock, verify } from "ts-mockito";
import { FindTopicApp } from "../../../../src/application/feedback/topic/find-topic-app";
import { ITopicRepository } from "../../../../src/domain/feedback/repository/topic-repository";
import { ExpiredAccessTokenError } from "../../../../src/domain/token/data/expired-access-token-error";
import { InvalidAccessTokenError } from "../../../../src/domain/token/data/invalid-access-token-error";
import { reject } from "../../../util/framework";
import { TopicFixture } from "./stuff/topic-fixture";

describe('Find topics tests', () => {
    let svc: FindTopicApp;
    let topicRepository: ITopicRepository;

    beforeEach(() => {
        topicRepository = mock<ITopicRepository>();

        TopicFixture.setupTopicRepository(topicRepository);

        svc = new FindTopicApp(instance(topicRepository));
    });

    test('should find the topics', async () => {
        const result = await svc.find(
            TopicFixture.Find.successAccessToken, TopicFixture.Find.successTopicQuery
        );
        expect(result).toEqual({ ...TopicFixture.Find.successTopicPage });
        verify(topicRepository.find(anyString(), anyNumber(), anyNumber())).once();
    });

    reject('should reject with invalid access token error', async () => { 
        await svc.find(
            TopicFixture.Find.invalidAccessToken, TopicFixture.Find.successTopicQuery
        );
    }, (err) => {
        expect(err).toBeInstanceOf(InvalidAccessTokenError);
        verify(topicRepository.find(anyString(), anyNumber(), anyNumber())).never();
    });

    reject('should reject with expired access token error', async () => { 
        await svc.find(
            TopicFixture.Find.expiredAccessToken, TopicFixture.Find.successTopicQuery
        );
    }, (err) => {
        expect(err).toBeInstanceOf(ExpiredAccessTokenError);
        verify(topicRepository.find(anyString(), anyNumber(), anyNumber())).never();
    });
});