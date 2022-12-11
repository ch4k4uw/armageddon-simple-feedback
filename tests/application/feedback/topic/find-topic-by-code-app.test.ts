import { anyString, instance, mock, verify } from "ts-mockito";
import { FindTopicByCodeApp } from "../../../../src/application/feedback/topic/find-topic-by-code-app";
import { TopicNotFoundError } from "../../../../src/domain/feedback/data/topic-not-found-error";
import { ITopicRepository } from "../../../../src/domain/feedback/repository/topic-repository";
import { reject } from "../../../util/framework";
import { TopicFixture } from "./stuff/topic-fixture";

describe('Find topic by code tests', () => {
    let svc: FindTopicByCodeApp;
    let topicRepository: ITopicRepository;

    beforeEach(() => {
        topicRepository = mock<ITopicRepository>();

        TopicFixture.setupTopicRepository(topicRepository);

        svc = new FindTopicByCodeApp(instance(topicRepository));
    });

    test('should find a topic', async () => {
        const result = await svc.find(TopicFixture.FindByCode.successCode);
        expect(result).toEqual({ ...TopicFixture.FindByCode.successTopic });
        verify(topicRepository.findByCode(anyString())).once();
    });

    reject('should reject with topic not found error', async () => {
        await svc.find(TopicFixture.FindByCode.topicNotFoundCode);
    }, (err) => {
        expect(err).toBeInstanceOf(TopicNotFoundError);
        verify(topicRepository.findByCode(anyString())).once();
    });
});