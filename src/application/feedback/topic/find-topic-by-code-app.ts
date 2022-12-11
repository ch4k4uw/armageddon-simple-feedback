import { Topic } from "../../../domain/feedback/entity/topic";
import { ITopicRepository } from "../../../domain/feedback/repository/topic-repository";

export class FindTopicByCodeApp {
    constructor(
        private topicRepository: ITopicRepository,
    ) { }

    async find(code: string): Promise<Topic> {
        return await this.topicRepository.findByCode(code);
    }
}