import { Role } from "../../../domain/credential/data/role";
import { TopicNotFoundError } from "../../../domain/feedback/data/topic-not-found-error";
import { Topic } from "../../../domain/feedback/entity/topic";
import { ITopicRepository } from "../../../domain/feedback/repository/topic-repository";
import { JwToken } from "../../../domain/token/data/jw-token";
import { AccessTokenAssertionApp } from "../common/access-token-assertion-app";

export class FindTopicByIdApp extends AccessTokenAssertionApp {
    constructor(
        private topicRepository: ITopicRepository,
    ) {
        super([Role.admin]);
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