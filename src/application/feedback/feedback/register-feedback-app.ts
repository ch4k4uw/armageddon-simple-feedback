import { FeedbackConstants } from "../../../domain/feedback/data/feedback-constants";
import { RatingOutOfRangeError } from "../../../domain/feedback/data/rating-out-of-range-error";
import { ReasonLengthOverflow } from "../../../domain/feedback/data/reason-length-overflow-error";
import { Feedback } from "../../../domain/feedback/entity/feedback";
import { IFeedbackCmdRepository } from "../../../domain/feedback/repository/feedback-cmd-repository";
import { FeedbackRegistration } from "./data/feedback-registration";

export class RegisterFeedbackApp {
    constructor(
        private feedbackRepository: IFeedbackCmdRepository,
    ) { }

    async register(feedback: FeedbackRegistration): Promise<Feedback> {
        this.assertReasonLength(feedback.reason);
        this.assertRatingRange(feedback.rating);
        const domainFeedback = new Feedback(
            undefined,
            feedback.topic,
            feedback.rating,
            feedback.reason,
        );
        return await this.feedbackRepository.insert(domainFeedback);
    }

    private assertReasonLength(reason: string) {
        if (reason.length >= FeedbackConstants.maxFeedbackReasonLength) {
            throw new ReasonLengthOverflow();
        }
    }

    private assertRatingRange(rating: number) {
        if (rating < FeedbackConstants.minRatingValue || rating > FeedbackConstants.maxRatingValue) {
            throw new RatingOutOfRangeError();
        }
    }
}