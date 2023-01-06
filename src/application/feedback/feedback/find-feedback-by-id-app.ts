import { Inject, Service } from "typedi";
import { Role } from "../../../domain/credential/data/role";
import { FeedbackNotFoundError } from "../../../domain/feedback/data/feedback-not-found-error";
import { Feedback } from "../../../domain/feedback/entity/feedback";
import { IFeedbackRepository } from "../../../domain/feedback/repository/feedback-repository";
import { JwToken } from "../../../domain/token/entity/jw-token";
import { IoCId } from "../../../ioc/ioc-id";
import { AccessTokenAssertionApp } from "../common/access-token-assertion-app";

@Service()
export class FindFeedbackByIdApp extends AccessTokenAssertionApp {
    constructor(
        @Inject(IoCId.Infra.FEEDBACK_REPOSITORY)
        private feedbackRepository: IFeedbackRepository,
    ) {
        super([Role.admin, Role.guest]);
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