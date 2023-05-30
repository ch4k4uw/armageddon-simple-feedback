import { TopicSummary } from "../../../../domain/feedback/data/topic-summary";
import { TopicView } from "./topic-view";

export class TopicSummaryView {
    readonly topic: TopicView;
    readonly expiresIn: number;
    readonly ratingAverage: number;
    readonly ratingHigh: number;
    readonly ratingLow: number;
    readonly answers: number;
    readonly ratingCount: number[];

    constructor(topicSummary: TopicSummary) {
        this.topic = new TopicView(topicSummary.topic);
        this.expiresIn = topicSummary.expiresIn;
        this.ratingAverage = topicSummary.ratingAverage;
        this.ratingHigh = topicSummary.ratingHigh;
        this.ratingLow = topicSummary.ratingLow;
        this.answers = topicSummary.answers;
        this.ratingCount = topicSummary.ratingCount;
    }
}