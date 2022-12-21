import { FeedbackConstants } from "../../../domain/feedback/data/feedback-constants";
import { TopicDuplicationError } from "../../../domain/feedback/data/topic-duplication-error";
import { TopicNotFoundError } from "../../../domain/feedback/data/topic-not-found-error";
import { TopicPage } from "../../../domain/feedback/data/topic-page";
import { TopicSummary } from "../../../domain/feedback/data/topic-summary";
import { Topic } from "../../../domain/feedback/entity/topic";
import { ITopicCmdRepository } from "../../../domain/feedback/repository/topic-cmd-repository";
import { IDatabase } from "../../database/database";
import { TopicModel } from "../../database/model/topic-model";
import { INanoIdService } from "../service/nano-id-service";
import { FeedbackInfraConstants } from "./feedback-infra-constants";

export class TopicCmdRepositoryImpl implements ITopicCmdRepository {
    constructor(private database: IDatabase, private nanoIdSvc: INanoIdService) { }

    async insert(topic: Topic): Promise<Topic> {
        if ((await this.database.findTopicExistsByTitle(topic.title))) {
            throw new TopicDuplicationError();
        }

        const now = this.database.dateTime;
        const topicModel = new TopicModel(
            await this.database.createId(),
            await this.findFreeNanoCode(),
            topic.title,
            topic.description,
            topic.author,
            topic.authorName,
            topic.expires.getTime(),
            now,
            now,
        );

        await this.database.insertTopic(topicModel);

        return topicModel.asDomain;
    }

    private async findFreeNanoCode(): Promise<string> {
        const svc = this.nanoIdSvc;
        const db = this.database;
        async function tryNextCode(): Promise<string> {
            const code = await svc.createId();
            if (!(await db.findTopicCodeExists(code))) {
                return code;
            } else {
                return await tryNextCode();
            }
        }

        return await tryNextCode();
    }

    async update(topic: Topic): Promise<Topic> {
        const existentTopic = await this.findById(topic.id);
        if (existentTopic === Topic.empty) {
            return Topic.empty;
        }
        const topicModel = new TopicModel(
            topic.id,
            topic.code,
            topic.title,
            topic.description,
            topic.author,
            topic.authorName,
            topic.expires.getTime(),
            existentTopic.created.getTime(),
            this.database.dateTime,
        );
        await this.database.updateTopic(topicModel);
        return topicModel.asDomain;
    }

    async delete(id: string): Promise<Topic> {
        const topicModel = await this.database.findTopicById(id);
        if (topicModel === null) {
            return Topic.empty;
        }
        await this.database.removeTopicById(id);
        return topicModel.asDomain;
    }

    async find(query?: string, size?: number, index?: number): Promise<TopicPage> {
        const topicPageModel = await this.database.findTopicPage(
            index || FeedbackInfraConstants.pageIndex,
            size || FeedbackInfraConstants.pageSize,
            {
                title: query,
                description: query
            },
        );
        return new TopicPage(
            topicPageModel.result.map((v) => v.asDomain),
            topicPageModel.size,
            topicPageModel.index,
            topicPageModel.total,
        );
    }

    async findById(id: string): Promise<Topic> {
        const result = await this.database.findTopicById(id);
        if (result === null) {
            return Topic.empty;
        }
        return result.asDomain;
    }

    async findByCode(code: string): Promise<Topic> {
        const result = await this.database.findTopicByCode(code);
        if (result === null) {
            return Topic.empty;
        }
        return result.asDomain;
    }

    async findSummary(id: string): Promise<TopicSummary> {
        const topic = await this.findById(id);
        if (topic === Topic.empty) {
            throw new TopicNotFoundError();
        }

        const feedbackSummariesModel = await this.database.findFeedbackSummariesByTopicId(id);

        const summary = feedbackSummariesModel.reduce((prev, curr) => {
            prev.ratingHigh = Math.max(prev.ratingHigh, curr.rating);
            prev.ratingLow = Math.min(prev.ratingLow, curr.rating);
            prev.ratingSum += curr.rating;
            return prev;
        }, {
            topic: topic,
            expiresIn: Math.round((topic.expires.getTime() - Date.now()) / (1000 * 3600 * 24)),
            ratingSum: 0,
            ratingHigh: FeedbackConstants.minRatingValue,
            ratingLow: FeedbackConstants.maxRatingValue,
            answers: feedbackSummariesModel.length,
        });

        return new TopicSummary(
            summary.topic,
            summary.expiresIn,
            summary.ratingSum / summary.answers,
            summary.ratingHigh,
            summary.ratingLow,
            summary.answers,
        );
    }
}