import { anyNumber, anyString, anything, capture, instance, verify } from "ts-mockito";
import { ExpiredTopicError } from "../../../../src/domain/feedback/data/expired-topic-error";
import { TopicNotFoundError } from "../../../../src/domain/feedback/data/topic-not-found-error";
import { Feedback } from "../../../../src/domain/feedback/entity/feedback";
import { IFeedbackCmdRepository } from "../../../../src/domain/feedback/repository/feedback-cmd-repository";
import { IDatabase } from "../../../../src/infra/database/database";
import { FeedbackCmdRepositoryImpl } from "../../../../src/infra/feedback/repository/feedback-cmd-repository-impl";
import { FeedbackInfraConstants } from "../../../../src/infra/feedback/repository/feedback-infra-constants";
import { reject } from "../../../util/framework";
import { FeedbackFixture } from "./stuff/feedback-fixture";

describe('Feedback repository tests', () => {
    describe('find page tests', () => {
        let repo: IFeedbackCmdRepository;
        let database: IDatabase;
        beforeEach(() => {
            database = FeedbackFixture.createDatabaseMock();
            repo = new FeedbackCmdRepositoryImpl(instance(database));
        });

        test('should find a feedback page', async () => {
            const result = await repo.find(FeedbackFixture.FindPage.Success.topic.id);

            expect(result).toEqual({ ...FeedbackFixture.FindPage.Success.pageDomain });
            verify(database.findTopicById(anyString())).once();
            const [topic, index, size] = capture(database.findFeedbackPage).first();
            expect(topic).toEqual(FeedbackFixture.FindPage.Success.topic.id);
            expect(index).toEqual(FeedbackInfraConstants.pageIndex);
            expect(size).toEqual(FeedbackInfraConstants.pageSize);
            verify(database.findFeedbackPage(anyString(), anyNumber(), anyNumber(), anything())).once();
        });

        reject('should reject with topic not found error', async () => {
            await repo.find(FeedbackFixture.FindPage.TopicNotFound.topic.id);
        }, (err) => {
            expect(err).toBeInstanceOf(TopicNotFoundError);
            verify(database.findTopicById(anyString())).once();
            verify(database.findFeedbackPage(anyString(), anyNumber(), anyNumber(), anything())).never();
        });
    });

    describe('find by id tests', () => {
        let repo: IFeedbackCmdRepository;
        let database: IDatabase;
        beforeEach(() => {
            database = FeedbackFixture.createDatabaseMock();
            repo = new FeedbackCmdRepositoryImpl(instance(database));
        });

        test('should find a feedback', async () => {
            const result = await repo.findById(FeedbackFixture.FindById.Success.feedback.id);
            expect(result).toEqual({ ...FeedbackFixture.FindById.Success.feedback.asDomain });
            verify(database.findFeedbackById(anyString())).once();
        });

        test('should return ampty feedback', async () => {
            const result = await repo.findById(FeedbackFixture.FindById.NotFound.feedback.id);
            expect(result).toEqual({ ...Feedback.empty });
            verify(database.findFeedbackById(anyString())).once();
        });
    });

    describe('insert tests', () => {
        let repo: IFeedbackCmdRepository;
        let database: IDatabase;
        beforeEach(() => {
            database = FeedbackFixture.createDatabaseMock();
            repo = new FeedbackCmdRepositoryImpl(instance(database));
        });

        test('should insert a feedback', async () => {
            const result = await repo.insert(FeedbackFixture.Insert.Success.feedbackDomain);
            expect(result.id).not.toEqual(FeedbackFixture.Insert.Success.feedbackDomain.id);
            expect(
                editObjectAsRaw(result, (obj) => delete obj.id)
            ).toEqual(
                editObjectAsRaw(FeedbackFixture.Insert.Success.feedbackDomain.id, (obj) => delete obj.id)
            )
            verify(database.findTopicById(anyString())).once();
            verify(database.createId()).once();
            verify(database.dateTime).once();
            verify(database.insertFeedback(anything())).once();
        });

        const editObjectAsRaw = (obj: any, edittion: (obj: any) => any): any =>
            edittion({ ...obj });

        reject('should reject with topic not found error', async () => {
            await repo.insert(FeedbackFixture.Insert.TopicNotFound.feedbackDomain);
        }, (err) => {
            expect(err).toBeInstanceOf(TopicNotFoundError);
            verify(database.findTopicById(anyString())).once();
            verify(database.createId()).never();
            verify(database.dateTime).never();
            verify(database.insertFeedback(anything())).never();
        });

        reject('should reject with expired topic error', async () => {
            await repo.insert(FeedbackFixture.Insert.TopicExpired.feedbackDomain);
        }, (err) => {
            expect(err).toBeInstanceOf(ExpiredTopicError);
            verify(database.findTopicById(anyString())).once();
            verify(database.createId()).never();
            verify(database.dateTime).never();
            verify(database.insertFeedback(anything())).never();
        });
    });
});