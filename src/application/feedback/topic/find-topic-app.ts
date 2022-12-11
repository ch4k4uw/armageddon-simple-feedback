import { Role } from "../../../domain/credential/data/role";
import { InvalidPageIndexError } from "../../../domain/feedback/data/invalid-page-index-error";
import { InvalidPageSizeError } from "../../../domain/feedback/data/invalid-page-size-error";
import { TopicPage } from "../../../domain/feedback/data/topic-page";
import { ITopicRepository } from "../../../domain/feedback/repository/topic-repository";
import { JwToken } from "../../../domain/token/data/jw-token";
import { AccessTokenAssertionApp } from "../common/access-token-assertion-app";
import { FeedbackQuery } from "../common/data/feedback-query";

export class FindTopicApp extends AccessTokenAssertionApp {
    constructor(
        private topicRepository: ITopicRepository,
    ) {
        super([Role.admin]);
    }

    async find(token: JwToken, query: FeedbackQuery): Promise<TopicPage> {
        this.assertToken(token);
        this.assertQuery(query);
        return await this.topicRepository.find(query.query, query.size, query.index);
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