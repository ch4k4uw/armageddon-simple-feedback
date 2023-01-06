import { Inject, Service } from "typedi";
import { Role } from "../../../domain/credential/data/role";
import { TopicNotFoundError } from "../../../domain/feedback/data/topic-not-found-error";
import { TopicSummary } from "../../../domain/feedback/data/topic-summary";
import { ITopicRepository } from "../../../domain/feedback/repository/topic-repository";
import { JwToken } from "../../../domain/token/entity/jw-token";
import { IoCId } from "../../../ioc/ioc-id";
import { AccessTokenAssertionApp } from "../common/access-token-assertion-app";

@Service()
export class FindTopicSummaryByIdApp extends AccessTokenAssertionApp {
    constructor(
        @Inject(IoCId.Infra.TOPIC_REPOSITORY)
        private topicRepository: ITopicRepository,
    ) {
        super([Role.admin, Role.guest]);
    }

    async find(token: JwToken, id: string): Promise<TopicSummary> {
        this.assertToken(token);
        const result = await this.topicRepository.findSummary(id);
        if (result === TopicSummary.empty) {
            throw new TopicNotFoundError();
        }
        return result;
    }
}