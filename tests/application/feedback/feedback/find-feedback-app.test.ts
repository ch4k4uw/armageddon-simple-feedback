import { anyNumber, anything, instance, mock, verify } from "ts-mockito";
import { FindFeedbackApp } from "../../../../src/application/feedback/feedback/find-feedback-app";
import { InvalidPageIndexError } from "../../../../src/domain/feedback/data/invalid-page-index-error";
import { InvalidPageSizeError } from "../../../../src/domain/feedback/data/invalid-page-size-error";
import { IFeedbackRepository } from "../../../../src/domain/feedback/repository/feedback-repository";
import { ExpiredAccessTokenError } from "../../../../src/domain/token/data/expired-access-token-error";
import { InvalidAccessTokenError } from "../../../../src/domain/token/data/invalid-access-token-error";
import { reject } from "../../../util/framework";
import { FeedbackFixture } from "./stuff/feedback-fixture";

describe('Find feedback tests', () => {
    let svc: FindFeedbackApp;
    let feedbackRepository: IFeedbackRepository;
    beforeEach(() => {
        feedbackRepository = mock<IFeedbackRepository>();

        FeedbackFixture.setupFeedbackRepository(feedbackRepository);

        svc = new FindFeedbackApp(instance(feedbackRepository));
    });

    test('should find some feedback', async () => {
        const result = await svc.find(
            FeedbackFixture.Find.successAccessToken,
            "",
            FeedbackFixture.Find.successFeedbackQuery,
        );
        expect(result).toEqual({ ...FeedbackFixture.Find.successFeedbackPage });
        verify(feedbackRepository.find(anything(), anyNumber(), anyNumber())).once();
    });

    reject('should reject with invalid page size error', async () => {
        await svc.find(
            FeedbackFixture.Find.successAccessToken,
            "",
            FeedbackFixture.Find.invalidPageSizeFeedbackQuery,
        );
    }, (err) => {
        expect(err).toBeInstanceOf(InvalidPageSizeError);
        verify(feedbackRepository.find(anything(), anyNumber(), anyNumber())).never();
    });
    reject('should reject with invalid page index error', async () => {
        await svc.find(
            FeedbackFixture.Find.successAccessToken,
            "",
            FeedbackFixture.Find.invalidPageIndexFeedbackQuery,
        );
    }, (err) => {
        expect(err).toBeInstanceOf(InvalidPageIndexError);
        verify(feedbackRepository.find(anything(), anyNumber(), anyNumber())).never();
    });
    reject('should reject with invalid access token error', async () => {
        await svc.find(
            FeedbackFixture.Find.invalidAccessToken,
            "",
            FeedbackFixture.Find.successFeedbackQuery,
        );
    }, (err) => {
        expect(err).toBeInstanceOf(InvalidAccessTokenError);
        verify(feedbackRepository.find(anything(), anyNumber(), anyNumber())).never();
    });
    reject('should reject with expired access token error', async () => {
        await svc.find(
            FeedbackFixture.Find.expiredAccessToken,
            "",
            FeedbackFixture.Find.successFeedbackQuery,
        );
    }, (err) => {
        expect(err).toBeInstanceOf(ExpiredAccessTokenError);
        verify(feedbackRepository.find(anything(), anyNumber(), anyNumber())).never();
    });
});