import { anyString, anything, instance, verify } from "ts-mockito";
import { Topic } from "../../../../src/domain/feedback/entity/topic";
import { TopicIdMetadata } from "../../../../src/domain/feedback/entity/topic-id-metadata";
import { ITopicIdMetadataRepository } from "../../../../src/domain/feedback/repository/topic-id-metadata-repository";
import { TopicIdMetadataRepositoryImpl } from "../../../../src/infra/feedback/repository/topic-id-metadata-repository-impl";
import { IJwTokenService } from "../../../../src/infra/token/service/jw-token-service";
import { TopicIdMetadataFixture } from "./stuff/topic-id-metadata-fixture";
import { TopicNotFoundError } from "../../../../src/domain/feedback/data/topic-not-found-error";
import { ITopicRepository } from "../../../../src/domain/feedback/repository/topic-repository";

describe('Topic id metadata repository tests', () => {
    describe('find by topic code tests', () => {
        let repo: ITopicIdMetadataRepository;
        let topicRepo: ITopicRepository;
        let svc: IJwTokenService;
        beforeEach(() => {
            const result = initialSetup();
            repo = result.repo;
            topicRepo = result.topicRepo;
            svc = result.svc;
        });

        test('should find a topic id metadata', async () => {
            const result = await repo.findByTopicCode(TopicIdMetadataFixture.FindByCode.Success.topicIdMetadataDomain.topic.code);

            expect(result).toEqual({ ...TopicIdMetadataFixture.FindByCode.Success.topicIdMetadataDomain });
            verify(topicRepo.findByCode(anyString())).once();
            verify(svc.createTopicIdMetadataToken(anything())).once();
        });

        test('shouldn\'t find a topic id metadata', async () => {
            const result = repo.findByTopicCode(TopicIdMetadataFixture.FindByCode.NotFound.topicIdMetadataDomain.topic.code);

            await expect(result).rejects.toThrow(TopicNotFoundError);
            verify(topicRepo.findByCode(anyString())).once();
            verify(svc.createTopicIdMetadataToken(anything())).never();
        });
    });

    function initialSetup(): { repo: ITopicIdMetadataRepository, topicRepo: ITopicRepository, svc: IJwTokenService} {
        const repo = TopicIdMetadataFixture.createTopicRepositoryMock();
        const svc = TopicIdMetadataFixture.createJwTokenServiceMock();
        return { 
            repo: new TopicIdMetadataRepositoryImpl(instance(svc), instance(repo)), 
            topicRepo: repo,
            svc 
        };
    }

    describe('find by topic id metadata tests', () => {
        let repo: ITopicIdMetadataRepository;
        let topicRepo: ITopicRepository;
        let svc: IJwTokenService;
        beforeEach(() => {
            const result = initialSetup();
            repo = result.repo;
            topicRepo = result.topicRepo;
            svc = result.svc;
        });

        test('should find a topic id metadata', async () => {
            const result = await repo.findByTopicIdMetadata(TopicIdMetadataFixture.FindByTopicIdMetadata.Success.idMetadata);

            expect(result).toEqual({ ...TopicIdMetadataFixture.FindByTopicIdMetadata.Success.topicIdMetadataDomain });
            verify(svc.verifyTopicIdMetadataToken(anyString())).once();
            verify(topicRepo.findByCode(anyString())).once();
        });

        test('shouldn\'t find a topic id metadata', async () => {
            const result = repo.findByTopicIdMetadata(TopicIdMetadataFixture.FindByTopicIdMetadata.NotFound.idMetadata);

            await expect(result).rejects.toThrow(TopicNotFoundError);
            verify(svc.verifyTopicIdMetadataToken(anyString())).once();
            verify(topicRepo.findByCode(anyString())).once();
        });
    });
});