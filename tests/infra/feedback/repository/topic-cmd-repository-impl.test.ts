import { report } from "process";
import { anyNumber, anyString, anything, instance, verify } from "ts-mockito";
import { TopicDuplicationError } from "../../../../src/domain/feedback/data/topic-duplication-error";
import { TopicNotFoundError } from "../../../../src/domain/feedback/data/topic-not-found-error";
import { Topic } from "../../../../src/domain/feedback/entity/topic";
import { ITopicCmdRepository } from "../../../../src/domain/feedback/repository/topic-cmd-repository";
import { IDatabase } from "../../../../src/infra/database/database";
import { TopicCmdRepositoryImpl } from "../../../../src/infra/feedback/repository/topic-cmd-repository-impl";
import { INanoIdService } from "../../../../src/infra/feedback/service/nano-id-service";
import { reject } from "../../../util/framework";
import { TopicFixture } from "./stuff/topic-fixture";

describe('Topic repository tests', () => {
    describe('insert tests', () => {
        let repo: ITopicCmdRepository;
        let database: IDatabase;
        let nanoIdSvc: INanoIdService;
        beforeEach(() => {
            const result = initialSetup();
            repo = result.repo;
            database = result.db;
            nanoIdSvc = result.nanoIdSvc;
        });

        test('should insert a topic', async () => {
            const result = await repo.insert(TopicFixture.Insert.Success.topicDomain);
            expect(result.id).not.toEqual(TopicFixture.Insert.Success.topicDomain.id);
            expect(result.code).not.toEqual(TopicFixture.Insert.Success.topicDomain.code);
            expect(result.created).not.toEqual(TopicFixture.Insert.Success.topicDomain.created);
            expect(result.updated).not.toEqual(TopicFixture.Insert.Success.topicDomain.updated);
            verify(database.findTopicExistsByTitle(anyString())).once();
            verify(database.dateTime).once();
            verify(database.createId()).once();
            verify(nanoIdSvc.createId()).times(4);
            verify(database.findTopicExistsByCode(anyString())).times(4);
            verify(database.insertTopic(anything())).once();
        });

        reject('should reject with topic duplication error', async () => {
            await repo.insert(TopicFixture.Insert.Duplication.topicDomain);
        }, (err) => {
            expect(err).toBeInstanceOf(TopicDuplicationError);
            verify(database.findTopicExistsByTitle(anyString())).once();
            verify(database.dateTime).never();
            verify(database.createId()).never();
            verify(nanoIdSvc.createId()).never();
            verify(database.findTopicExistsByCode(anyString())).never();
            verify(database.insertTopic(anything())).never();
        });
    });

    function initialSetup(): { repo: ITopicCmdRepository, db: IDatabase, nanoIdSvc: INanoIdService } {
        TopicFixture.resetNanoId();
        const db = TopicFixture.createDatabaseMock();
        const nanoIdSvc = TopicFixture.createNanoIdSvcMock();
        return {
            repo: new TopicCmdRepositoryImpl(instance(db), instance(nanoIdSvc)),
            db,
            nanoIdSvc
        };
    }

    describe('update tests', () => {
        let repo: ITopicCmdRepository;
        let database: IDatabase;
        let nanoIdSvc: INanoIdService;
        beforeEach(() => {
            const result = initialSetup();
            repo = result.repo;
            database = result.db;
            nanoIdSvc = result.nanoIdSvc;
        });

        test('should update a topic', async () => {
            const result = await repo.update(TopicFixture.Update.Success.topicDomain);
            expect(result.id).toEqual(TopicFixture.Insert.Success.topicDomain.id);
            expect(result.code).toEqual(TopicFixture.Insert.Success.topicDomain.code);
            expect(result.created).toEqual(TopicFixture.Insert.Success.topicDomain.created);
            expect(result.updated).not.toEqual(TopicFixture.Insert.Success.topicDomain.updated);
            verify(database.findTopicById(anyString())).once();
            verify(database.updateTopic(anything())).once();
        });

        test('shouldn\'t update a topic', async () => {
            const result = await repo.update(TopicFixture.Update.NotFound.topicDomain);
            expect(result).toEqual(Topic.empty)
            verify(database.findTopicById(anyString())).once();
            verify(database.updateTopic(anything())).never();
        });
    });

    describe('delete tests', () => {
        let repo: ITopicCmdRepository;
        let database: IDatabase;
        let nanoIdSvc: INanoIdService;
        beforeEach(() => {
            const result = initialSetup();
            repo = result.repo;
            database = result.db;
            nanoIdSvc = result.nanoIdSvc;
        });

        test('should delete a topic', async () => {
            const result = await repo.delete(TopicFixture.Delete.Success.topicDomain.id);
            expect(result).toEqual({ ...TopicFixture.Delete.Success.topicDomain });
            verify(database.findTopicById(anyString())).once();
            verify(database.removeTopicById(anything())).once();
        });

        test('shouldn\'t delete a topic', async () => {
            const result = await repo.delete(TopicFixture.Delete.NotFound.topicDomain.id);
            expect(result).toEqual(Topic.empty)
            verify(database.findTopicById(anyString())).once();
            verify(database.removeTopicById(anything())).never();
        });
    });

    describe('find page tests', () => {
        let repo: ITopicCmdRepository;
        let database: IDatabase;
        let nanoIdSvc: INanoIdService;
        beforeEach(() => {
            const result = initialSetup();
            repo = result.repo;
            database = result.db;
            nanoIdSvc = result.nanoIdSvc;
        });

        test('should find a topic page', async () => {
            const result = await repo.find();
            expect(result).toEqual({ ...TopicFixture.Find.Success.topicPageDomain });
            verify(database.findTopicPage(anyNumber(), anyNumber(), anything())).once();
        });
    });

    describe('find by id tests', () => {
        let repo: ITopicCmdRepository;
        let database: IDatabase;
        let nanoIdSvc: INanoIdService;
        beforeEach(() => {
            const result = initialSetup();
            repo = result.repo;
            database = result.db;
            nanoIdSvc = result.nanoIdSvc;
        });

        test('should find a topic', async () => {
            const result = await repo.findById(TopicFixture.FindById.Success.topic.id);

            expect(result).toEqual({ ...TopicFixture.FindById.Success.topicDomain });
            verify(database.findTopicById(anyString())).once();
        });

        test('shouldn\'t find a topic', async () => {
            const result = await repo.findById(TopicFixture.FindById.NotFound.topic.id);

            expect(result).toEqual(Topic.empty);
            verify(database.findTopicById(anyString())).once();
        });
    });

    describe('find by code tests', () => {
        let repo: ITopicCmdRepository;
        let database: IDatabase;
        let nanoIdSvc: INanoIdService;
        beforeEach(() => {
            const result = initialSetup();
            repo = result.repo;
            database = result.db;
            nanoIdSvc = result.nanoIdSvc;
        });

        test('should find a topic', async () => {
            const result = await repo.findByCode(TopicFixture.FindByCode.Success.topic.id);

            expect(result).toEqual({ ...TopicFixture.FindByCode.Success.topicDomain });
            verify(database.findTopicByCode(anyString())).once();
        });

        test('shouldn\'t find a topic', async () => {
            const result = await repo.findByCode(TopicFixture.FindByCode.NotFound.topic.id);

            expect(result).toEqual(Topic.empty);
            verify(database.findTopicByCode(anyString())).once();
        });
    });

    describe('find summary tests', () => {
        let repo: ITopicCmdRepository;
        let database: IDatabase;
        let nanoIdSvc: INanoIdService;
        beforeEach(() => {
            const result = initialSetup();
            repo = result.repo;
            database = result.db;
            nanoIdSvc = result.nanoIdSvc;
        });

        test('should find a topic summary', async () => {
            const result = await repo.findSummary(TopicFixture.FindSummay.Success.topic.id);

            expect(result).toEqual({ ...TopicFixture.FindSummay.Success.feedbackSummary });
            verify(database.findFeedbackSummariesByTopicId(anyString())).once();
        });

        reject('shouldn\'t find a topic summary', async () => {
            await repo.findSummary(TopicFixture.FindSummay.NotFound.topic.id);
        }, (err) => {
            expect(err).toBeInstanceOf(TopicNotFoundError);
            verify(database.findFeedbackSummariesByTopicId(anyString())).never();
        });
    });
});