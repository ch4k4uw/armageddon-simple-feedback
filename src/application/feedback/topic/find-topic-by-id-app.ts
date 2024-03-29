import { Inject, Service } from "typedi";
import { Role } from "../../../domain/credential/data/role";
import { TopicNotFoundError } from "../../../domain/feedback/data/topic-not-found-error";
import { Topic } from "../../../domain/feedback/entity/topic";
import { ITopicRepository } from "../../../domain/feedback/repository/topic-repository";
import { JwToken } from "../../../domain/token/entity/jw-token";
import { IoCId } from "../../../ioc/ioc-id";
import { AccessTokenAssertionApp } from "../common/access-token-assertion-app";

@Service()
export class FindTopicByIdApp extends AccessTokenAssertionApp {
    constructor(
        @Inject(IoCId.Infra.TOPIC_REPOSITORY)
        private topicRepository: ITopicRepository,
    ) {
        super([Role.admin, Role.guest]);
    }

    async find(token: JwToken, id: string): Promise<Topic> {
        this.assertToken(token);
        const result = await this.topicRepository.findById(id);
        if (result === Topic.empty) {
            throw new TopicNotFoundError();
        }
        return result;
    }
}