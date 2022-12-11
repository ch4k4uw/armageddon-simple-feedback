import { Topic } from "../entity/topic";

export class TopicSummary {
    constructor(
        public topic: Topic = Topic.empty,
        public expiresIn: number,
        public ratingAverage: number = 0,
        public ratingHigh: number = 0,
        public ratingLow: number = 0,
        public answers: number = 0,
    ) { }
}