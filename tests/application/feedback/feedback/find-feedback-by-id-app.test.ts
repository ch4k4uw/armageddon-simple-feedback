import { anyString, instance, mock, verify } from "ts-mockito";
import { FindFeedbackByIdApp } from "../../../../src/application/feedback/feedback/find-feedback-by-id-app";
import { FeedbackNotFoundError } from "../../../../src/domain/feedback/data/feedback-not-found-error";
import { IFeedbackRepository } from "../../../../src/domain/feedback/repository/feedback-repository";
import { ExpiredAccessTokenError } from "../../../../src/domain/token/data/expired-access-token-error";
import { InvalidAccessTokenError } from "../../../../src/domain/token/data/invalid-access-token-error";
import { reject } from "../../../util/framework";
import { FeedbackFixture } from "./stuff/feedback-fixture";

describe('Find feedback by id', () => {
    let svc: FindFeedbackByIdApp;
    let feedbackRepository: IFeedbackRepository;
    beforeEach(() => {
        feedbackRepository = mock<IFeedbackRepository>();

        FeedbackFixture.setupFeedbackRepository(feedbackRepository);

        svc = new FindFeedbackByIdApp(instance(feedbackRepository));
    });

    test('should find a feedback', async () => {
        const result = await svc.find(
            FeedbackFixture.FindById.successAccessToken,
            FeedbackFixture.FindById.successFeedbackId,
        );
        expect(result).toEqual({ ...FeedbackFixture.FindById.successFeedback });
        verify(feedbackRepository.findById(anyString())).once();
    });

    reject('should reject with invalid access token error', async () => {
        await svc.find(
            FeedbackFixture.FindById.invalidAccessToken,
            FeedbackFixture.FindById.successFeedbackId,
        );
    }, (err) => {
        expect(err).toBeInstanceOf(InvalidAccessTokenError);
        verify(feedbackRepository.findById(anyString())).never();
    });

    reject('should reject with expired access token error', async () => {
        await svc.find(
            FeedbackFixture.FindById.expiredAccessToken,
            FeedbackFixture.FindById.successFeedbackId,
        );
    }, (err) => {
        expect(err).toBeInstanceOf(ExpiredAccessTokenError);
        verify(feedbackRepository.findById(anyString())).never();
    });

    reject('should reject with feeback not found error', async () => {
        await svc.find(
            FeedbackFixture.FindById.successAccessToken,
            FeedbackFixture.FindById.notFoundFeedbackId,
        );
    }, (err) => {
        expect(err).toBeInstanceOf(FeedbackNotFoundError);
        verify(feedbackRepository.findById(anyString())).once();
    });
});