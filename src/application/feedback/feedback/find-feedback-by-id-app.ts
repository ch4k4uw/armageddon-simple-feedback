import { Role } from "../../../domain/credential/data/role";
import { FeedbackNotFoundError } from "../../../domain/feedback/data/feedback-not-found-error";
import { Feedback } from "../../../domain/feedback/entity/feedback";
import { IFeedbackRepository } from "../../../domain/feedback/repository/feedback-repository";
import { JwToken } from "../../../domain/token/data/jw-token";
import { AccessTokenAssertionApp } from "../common/access-token-assertion-app";

export class FindFeedbackByIdApp extends AccessTokenAssertionApp {
    constructor(
        private feedbackRepository: IFeedbackRepository,
    ) {
        super([Role.admin]);
    }

    async find(token: JwToken, id: string): Promise<Feedback> {
        this.assertToken(token);
        const result = await this.feedbackRepository.findById(id);
        if (result === Feedback.empty) {
            throw new FeedbackNotFoundError();
        }
        return result;
    }
}