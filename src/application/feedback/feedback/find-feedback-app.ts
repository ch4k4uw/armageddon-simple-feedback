import { Inject, Service } from "typedi";
import { Role } from "../../../domain/credential/data/role";
import { FeedbackPage } from "../../../domain/feedback/data/feedback-page";
import { InvalidPageIndexError } from "../../../domain/feedback/data/invalid-page-index-error";
import { InvalidPageSizeError } from "../../../domain/feedback/data/invalid-page-size-error";
import { IFeedbackRepository } from "../../../domain/feedback/repository/feedback-repository";
import { JwToken } from "../../../domain/token/entity/jw-token";
import { IoCId } from "../../../ioc/ioc-id";
import { AccessTokenAssertionApp } from "../common/access-token-assertion-app";
import { FeedbackQuery } from "../common/data/feedback-query";

@Service()
export class FindFeedbackApp extends AccessTokenAssertionApp {
    constructor(
        @Inject(IoCId.Infra.FEEDBACK_REPOSITORY)
        private feedbackRepository: IFeedbackRepository,
    ) {
        super([Role.admin]);
    }

    async find(token: JwToken, topic: string, query: FeedbackQuery): Promise<FeedbackPage> {
        this.assertToken(token);
        this.assertQuery(query);
        return await this.feedbackRepository.find(topic, query.query, query.size, query.index);
    }

    private assertQuery(query: FeedbackQuery) {
        if (query.index <= 0) {
            throw new InvalidPageIndexError();
        }
        if (query.size <= 0) {
            throw new InvalidPageSizeError();
        }
    }
}