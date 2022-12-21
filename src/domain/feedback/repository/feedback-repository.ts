import { FeedbackPage } from "../data/feedback-page";
import { Feedback } from "../entity/feedback";

export interface IFeedbackRepository {
    find(topic: string, query?: string, size?: number, index?: number): Promise<FeedbackPage>
    findById(id: string): Promise<Feedback>;
}