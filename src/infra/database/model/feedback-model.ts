import { Feedback } from "../../../domain/feedback/entity/feedback";

export class FeedbackModel {
    constructor(
        public readonly id: string = "",
        public readonly topic: string = "",
        public readonly rating: number = 0,
        public readonly reason: string = "",
        public readonly created: number = Date.now(),
    ) { }

    get asDomain(): Feedback {
        return new Feedback(
            this.id,
            this.topic,
            this.rating,
            this.reason,
            this.created,
        );
    }
}