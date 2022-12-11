import { Role } from "../../../domain/credential/data/role";
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
        return await this.feedbackRepository.findById(id);
    }
}