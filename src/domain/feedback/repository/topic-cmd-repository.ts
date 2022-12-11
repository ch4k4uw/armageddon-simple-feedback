import { Topic } from "../entity/topic";
import { ITopicRepository } from "./topic-repository";

export interface ITopicCmdRepository extends ITopicRepository {
    insert(topic: Topic): Promise<Topic>;
    update(topic: Topic): Promise<Topic>;
    delete(id: string): Promise<Topic>;
}