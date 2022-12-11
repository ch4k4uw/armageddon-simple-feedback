import { Feedback } from "../entity/feedback";

export class FeedbackPage {
    constructor(
        public readonly feedback: Feedback[],
        public readonly size: number,
        public readonly index: number,
        public readonly total: number,
    ) { }
}