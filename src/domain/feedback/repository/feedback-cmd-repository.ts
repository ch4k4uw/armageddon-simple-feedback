import { Feedback } from "../entity/feedback";
import { IFeedbackRepository } from "./feedback-repository";

export interface IFeedbackCmdRepository extends IFeedbackRepository {
    insert(feedback: Feedback): Promise<Feedback>;
}