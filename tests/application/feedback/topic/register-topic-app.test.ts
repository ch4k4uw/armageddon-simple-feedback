import { anything, capture, instance, mock, verify } from "ts-mockito";
import { RegisterTopicApp } from "../../../../src/application/feedback/topic/register-topic-app";
import { ExpiredTopicError } from "../../../../src/domain/feedback/data/expired-topic-error";
import { ITopicCmdRepository } from "../../../../src/domain/feedback/repository/topic-cmd-repository";
import { ExpiredAccessTokenError } from "../../../../src/domain/token/data/expired-access-token-error";
import { InvalidAccessTokenError } from "../../../../src/domain/token/data/invalid-access-token-error";
import { reject } from "../../../util/framework";
import { TopicFixture } from "./stuff/topic-fixture";

describe('Register topic tests', () => {
    let svc: RegisterTopicApp;
    let topicRepository: ITopicCmdRepository;
    beforeEach(() => {
        topicRepository = mock<ITopicCmdRepository>();

        TopicFixture.setupTopicRepository(topicRepository);

        svc = new RegisterTopicApp(instance(topicRepository));
    });

    test('should register a topic', async () => {
        const result = await svc.register(
            TopicFixture.RegisterTopic.successAccessToken, TopicFixture.RegisterTopic.successTopicRegistration
        );
        verify(topicRepository.insert(anything())).once();
        const [intermediaryTopic] = capture(topicRepository.insert).last();
        expect(intermediaryTopic).toEqual({ ...TopicFixture.RegisterTopic.successIntermediaryTopicRegistration });
        expect(result).toEqual({ ...TopicFixture.RegisterTopic.successTopic });
    });

    reject('should reject with invalid access token error', async () => {
        await svc.register(
            TopicFixture.RegisterTopic.invalidAccessToken, TopicFixture.RegisterTopic.successTopicRegistration
        );
    }, (err) => {
        expect(err).toBeInstanceOf(InvalidAccessTokenError);
        verify(topicRepository.insert(anything())).never();
    });
    
    reject('should reject with expired access token error', async () => {
        await svc.register(
            TopicFixture.RegisterTopic.expiredAccessToken, TopicFixture.RegisterTopic.successTopicRegistration
        );
    }, (err) => {
        expect(err).toBeInstanceOf(ExpiredAccessTokenError);
        verify(topicRepository.insert(anything())).never();
    });

    reject('should reject with topic expired error', async () => {
        await svc.register(
            TopicFixture.RegisterTopic.successAccessToken, TopicFixture.RegisterTopic.expiredTopicRegistration
        );
    }, (err) => {
        expect(err).toBeInstanceOf(ExpiredTopicError);
        verify(topicRepository.insert(anything())).never();
    });
});