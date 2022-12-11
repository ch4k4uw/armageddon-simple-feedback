import { Topic } from "../entity/topic";

export class TopicPage {
    constructor(
        public topics: Topic[],
        public size: number,
        public index: number,
        public total: number,
    ) { }
}