import { Inject, Service } from "typedi";
import { Role } from "../../../domain/credential/data/role";
import { ExpiredTopicError } from "../../../domain/feedback/data/expired-topic-error";
import { Topic } from "../../../domain/feedback/entity/topic";
import { ITopicCmdRepository } from "../../../domain/feedback/repository/topic-cmd-repository";
import { JwToken } from "../../../domain/token/entity/jw-token";
import { IoCId } from "../../../ioc/ioc-id";
import { AccessTokenAssertionApp } from "../common/access-token-assertion-app";
import { TopicRegistration } from "./data/topic-registration";

@Service()
export class RegisterTopicApp extends AccessTokenAssertionApp {
    constructor(
        @Inject(IoCId.Infra.TOPIC_CMD_REPOSITORY)
        private topicRepository: ITopicCmdRepository
    ) {
        super([Role.admin]);
    }

    async register(token: JwToken, topic: TopicRegistration): Promise<Topic> {
        this.assertToken(token);
        const domainTopic = new Topic(
            undefined,
            undefined,
            topic.title,
            topic.description,
            token.loggedUser.id,
            token.loggedUser.name,
            topic.expiration,
        );
        if (domainTopic.isExpired) {
            throw new ExpiredTopicError();
        }
        return await this.topicRepository.insert(domainTopic);
    }
}