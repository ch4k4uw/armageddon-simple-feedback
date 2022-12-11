import { Role } from "../../../domain/credential/data/role";
import { TopicSummary } from "../../../domain/feedback/data/topic-summary";
import { ITopicRepository } from "../../../domain/feedback/repository/topic-repository";
import { JwToken } from "../../../domain/token/data/jw-token";
import { AccessTokenAssertionApp } from "../common/access-token-assertion-app";

export class FindTopicSummaryByIdApp extends AccessTokenAssertionApp {
    constructor(
        private topicRepository: ITopicRepository,
    ) { 
        super([Role.admin]);
    }

    async find(token: JwToken, id: string): Promise<TopicSummary> {
        this.assertToken(token);
        return await this.topicRepository.findSummary(id);
    }
}