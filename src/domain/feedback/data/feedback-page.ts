import { Feedback } from "../entity/feedback";

export class FeedbackPage {
    constructor(
        public feedback: Feedback[],
        public size: number,
        public index: number,
        public total: number,
    ) { }
}