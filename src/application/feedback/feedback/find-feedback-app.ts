import { Role } from "../../../domain/credential/data/role";
import { FeedbackPage } from "../../../domain/feedback/data/feedback-page";
import { IFeedbackRepository } from "../../../domain/feedback/repository/feedback-repository";
import { JwToken } from "../../../domain/token/data/jw-token";
import { AccessTokenAssertionApp } from "../common/access-token-assertion-app";
import { FeedbackQuery } from "../common/data/feedback-query";

export class FindFeedbackApp extends AccessTokenAssertionApp {
    constructor(
        private feedbackRepository: IFeedbackRepository,
    ) {
        super([Role.admin]);
    }

    async find(token: JwToken, query: FeedbackQuery): Promise<FeedbackPage> {
        this.assertToken(token);
        return await this.feedbackRepository.find(query.query, query.size, query.index);
    }
}