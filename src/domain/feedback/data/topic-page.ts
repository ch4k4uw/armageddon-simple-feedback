import { Topic } from "../entity/topic";

export class TopicPage {
    constructor(
        public readonly topics: Topic[],
        public readonly size: number,
        public readonly index: number,
        public readonly total: number,
    ) { }

    cloneWith(
        topics?: Topic[],
        size?: number,
        index?: number,
        total?: number,
    ): TopicPage {
        topics = topics == undefined ? this.topics : topics;
        size = size == undefined ? this.size : size;
        index = index == undefined ? this.index : index;
        total = total == undefined ? this.total : total;
        return new TopicPage(topics, size, index, total);
    }
}