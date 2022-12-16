import { FeedbackPage } from "../../../domain/feedback/data/feedback-page";
import { TopicNotFoundError } from "../../../domain/feedback/data/topic-not-found-error";
import { Feedback } from "../../../domain/feedback/entity/feedback";
import { IFeedbackCmdRepository } from "../../../domain/feedback/repository/feedback-cmd-repository";
import { IDatabase } from "../../database/database";
import { FeedbackModel } from "../../database/model/feedback-model";
import { TopicModel } from "../../database/model/topic-model";
import { FeedbackInfraConstants } from "./feedback-infra-constants";

export class FeedbackCmdRepositoryImpl implements IFeedbackCmdRepository {
    constructor(private database: IDatabase) { }

    async insert(feedback: Feedback): Promise<Feedback> {
        const topic = await this.assertTopic(feedback.topic);

        const feedbackModel = new FeedbackModel(
            await this.database.createId(),
            topic.id,
            feedback.rating,
            feedback.reason,
            this.database.dateTime,
        );

        await this.database.insertFeedback(feedbackModel);

        return feedbackModel.asDomain;
    }

    private async assertTopic(id: string): Promise<TopicModel> {
        const result = await this.database.findTopicById(id);
        if (result === null) {
            throw new TopicNotFoundError();
        }
        return result;
    }

    async find(topic: string, query?: string, size?: number, index?: number): Promise<FeedbackPage> {
        await this.assertTopic(topic);
        const pageModel = await this.database.findFeedbackPage(
            topic,
            index || FeedbackInfraConstants.pageIndex,
            size || FeedbackInfraConstants.pageSize,
            {
                reason: query,
            }
        );
        return new FeedbackPage(
            pageModel.result.map((v) => v.asDomain),
            pageModel.size,
            pageModel.index,
            pageModel.total,
        )
    }

    async findById(id: string): Promise<Feedback> {
        const feedbakModel = await this.database.findFeedbackById(id);
        if (feedbakModel === null) {
            return Feedback.empty;
        }
        return feedbakModel.asDomain;
    }

}