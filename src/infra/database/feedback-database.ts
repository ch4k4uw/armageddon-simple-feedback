import { FeedbackModel } from "./model/feedback-model";
import { FeedbackSummaryModel } from "./model/feedback-summary-model";
import { PagedModel } from "./model/paged-model";

export interface IFeedbackQueryOptions {
    readonly reason?: string;
    readonly rating?: number;
}

export interface IFeedbackDatabase {
    insertFeedback(feedback: FeedbackModel): Promise<void>;
    findFeedbackById(id: string): Promise<FeedbackModel|null>;
    findFeedbackSummariesByTopicId(id: string): Promise<FeedbackSummaryModel[]>;
    findFeedbackPage(topic: string, index: number, size: number, options?: IFeedbackQueryOptions): Promise<PagedModel<FeedbackModel>>;
}