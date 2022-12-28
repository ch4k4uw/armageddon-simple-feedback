import { PagedModel } from "./model/paged-model";
import { TopicModel } from "./model/topic-model";

export interface ITopicQueryOptions {
    readonly title?: string;
    readonly description?: string;
}

export interface ITopicDatabase {
    insertTopic(topic: TopicModel): Promise<void>;
    updateTopic(topic: TopicModel): Promise<void>;
    removeTopicById(id: string): Promise<void>;
    findTopicById(id: string): Promise<TopicModel|null>;
    findTopicByCode(code: string): Promise<TopicModel|null>;
    findTopicExistsByTitle(title: string): Promise<boolean>;
    findTopicExistsByCode(code: string): Promise<boolean>;
    findTopicPage(index: number, size: number, options?: ITopicQueryOptions): Promise<PagedModel<TopicModel>>;
}