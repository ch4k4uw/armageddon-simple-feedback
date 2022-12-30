import { Inject, Service } from "typedi";
import { Role } from "../../../domain/credential/data/role";
import { TopicNotFoundError } from "../../../domain/feedback/data/topic-not-found-error";
import { Topic } from "../../../domain/feedback/entity/topic";
import { ITopicCmdRepository } from "../../../domain/feedback/repository/topic-cmd-repository";
import { JwToken } from "../../../domain/token/entity/jw-token";
import { IoCId } from "../../../ioc/ioc-id";
import { AccessTokenAssertionApp } from "../common/access-token-assertion-app";

@Service()
export class RemoveTopicApp extends AccessTokenAssertionApp {
    constructor(
        @Inject(IoCId.Infra.TOPIC_CMD_REPOSITORY)
        private topicRepository: ITopicCmdRepository
    ) {
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