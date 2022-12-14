import { Role } from "../../../domain/credential/data/role";
import { TopicNotFoundError } from "../../../domain/feedback/data/topic-not-found-error";
import { Topic } from "../../../domain/feedback/entity/topic";
import { ITopicCmdRepository } from "../../../domain/feedback/repository/topic-cmd-repository";
import { JwToken } from "../../../domain/token/entity/jw-token";
import { AccessTokenAssertionApp } from "../common/access-token-assertion-app";

export class RemoveTopicApp extends AccessTokenAssertionApp {
    constructor(private topicRepository: ITopicCmdRepository) {
        super([Role.admin]);
    }

    async remove(token: JwToken, id: string): Promise<Topic> {
        this.assertToken(token);
        const result = await this.topicRepository.delete(id);
        if (result === Topic.empty) {
            throw new TopicNotFoundError();
        }
        return result;
    }
}