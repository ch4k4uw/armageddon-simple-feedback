import { TopicPage } from "../data/topic-page";
import { TopicSummary } from "../data/topic-summary";
import { Topic } from "../entity/topic";

export interface ITopicRepository {
    find(query?: string, size?: number, index?: number): Promise<TopicPage>;
    findById(id: string): Promise<Topic>;
    findByCode(code: string): Promise<Topic>;
    findSummary(id: string): Promise<TopicSummary>;
}
