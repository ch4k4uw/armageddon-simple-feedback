import { Topic } from "../entity/topic";

export class TopicSummary {
    constructor(
        public readonly topic: Topic = Topic.empty,
        public readonly expiresIn: number = 0,
        public readonly ratingAverage: number = 0,
        public readonly ratingHigh: number = 0,
        public readonly ratingLow: number = 0,
        public readonly answers: number = 0,
    ) { }

    static readonly empty = new TopicSummary();
}