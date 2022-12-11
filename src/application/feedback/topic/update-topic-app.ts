import { Role } from "../../../domain/credential/data/role";
import { ExpiredTopicError } from "../../../domain/feedback/data/expired-topic-error";
import { Topic } from "../../../domain/feedback/entity/topic";
import { ITopicCmdRepository } from "../../../domain/feedback/repository/topic-cmd-repository";
import { JwToken } from "../../../domain/token/data/jw-token";
import { AccessTokenAssertionApp } from "../common/access-token-assertion-app";
import { TopicUpdate } from "./data/topic-update";

export class UpdateTopicApp extends AccessTokenAssertionApp {
    constructor(private topicRepository: ITopicCmdRepository) { 
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
        return await this.topicRepository.update(domainTopic);
    }
}