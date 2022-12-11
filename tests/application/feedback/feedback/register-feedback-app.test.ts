import { anything, instance, mock, verify } from "ts-mockito";
import { RegisterFeedbackApp } from "../../../../src/application/feedback/feedback/register-feedback-app";
import { RatingOutOfRangeError } from "../../../../src/domain/feedback/data/rating-out-of-range-error";
import { ReasonLengthOverflow } from "../../../../src/domain/feedback/data/reason-length-overflow-error";
import { IFeedbackCmdRepository } from "../../../../src/domain/feedback/repository/feedback-cmd-repository";
import { reject } from "../../../util/framework";
import { FeedbackFixture } from "./stuff/feedback-fixture";

describe('Register feedback tests', () => {
    let svc: RegisterFeedbackApp;
    let feedbackRepository: IFeedbackCmdRepository;
    beforeEach(() => {
        feedbackRepository = mock<IFeedbackCmdRepository>();

        FeedbackFixture.setupFeedbackRepository(feedbackRepository);

        svc = new RegisterFeedbackApp(instance(feedbackRepository))
    });

    test('should find a feedback', async () => {
        const result = await svc.register(FeedbackFixture.Register.successFeedbackRegistration);
        expect(result).toEqual({ ...FeedbackFixture.Register.successFeedback });
        verify(feedbackRepository.insert(anything())).once();
    });

    reject('should reject with reason length overflow error', async () => {
        await svc.register(FeedbackFixture.Register.invalidReasonFeedbackRegistration);
    }, (err) => {
        expect(err).toBeInstanceOf(ReasonLengthOverflow);
        verify(feedbackRepository.insert(anything())).never();
    });

    reject('should reject with rating out of range error 1', async () => {
        await svc.register(FeedbackFixture.Register.invalidRatingFeedbackRegistration1);
    }, (err) => {
        expect(err).toBeInstanceOf(RatingOutOfRangeError);
        verify(feedbackRepository.insert(anything())).never();
    });

    reject('should reject with rating out of range error 2', async () => {
        await svc.register(FeedbackFixture.Register.invalidRatingFeedbackRegistration2);
    }, (err) => {
        expect(err).toBeInstanceOf(RatingOutOfRangeError);
        verify(feedbackRepository.insert(anything())).never();
    });
});