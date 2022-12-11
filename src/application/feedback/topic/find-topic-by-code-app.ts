import { TopicNotFoundError } from "../../../domain/feedback/data/topic-not-found-error";
import { Topic } from "../../../domain/feedback/entity/topic";
import { ITopicRepository } from "../../../domain/feedback/repository/topic-repository";

export class FindTopicByCodeApp {
    constructor(
        private topicRepository: ITopicRepository,
    ) { }

    async find(code: string): Promise<Topic> {
        const result = await this.topicRepository.findByCode(code);
        if (result === Topic.empty) {
            throw new TopicNotFoundError();
        }
        return result;
    }
}