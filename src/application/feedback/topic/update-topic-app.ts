import { Inject, Service } from "typedi";
import { Role } from "../../../domain/credential/data/role";
import { ExpiredTopicError } from "../../../domain/feedback/data/expired-topic-error";
import { TopicNotFoundError } from "../../../domain/feedback/data/topic-not-found-error";
import { Topic } from "../../../domain/feedback/entity/topic";
import { ITopicCmdRepository } from "../../../domain/feedback/repository/topic-cmd-repository";
import { JwToken } from "../../../domain/token/entity/jw-token";
import { IoCId } from "../../../ioc/ioc-id";
import { AccessTokenAssertionApp } from "../common/access-token-assertion-app";
import { TopicUpdate } from "./data/topic-update";

@Service()
export class UpdateTopicApp extends AccessTokenAssertionApp {
    constructor(
        @Inject(IoCId.Infra.TOPIC_CMD_REPOSITORY)
        private topicRepository: ITopicCmdRepository
    ) {
        super([Role.admin]);
    }

    async update(token: JwToken, topic: TopicUpdate): Promise<Topic> {
        this.assertToken(token);
        const domainTopic = new Topic(
            topic.id,
            undefined,
            topic.title,
            topic.description,
            undefined,
            undefined,
            topic.expiration,
        );
        if (domainTopic.isExpired) {
            throw new ExpiredTopicError();
        }
        const result = await this.topicRepository.update(domainTopic);
        if (result === Topic.empty) {
            throw new TopicNotFoundError();
        }
        return result;
    }
}