import { Response } from "express";
import { Service } from "typedi";
import { FeedbackQuery } from "../../../application/feedback/common/data/feedback-query";
import { FindTopicApp } from "../../../application/feedback/topic/find-topic-app";
import { IAuthRequest } from "../common/req-auth";
import { BaseAuthRequestHandler } from "./base-auth-request.handler";
import { TopicPageView } from "./insteraction/topic-page-view";

@Service()
export class RequestTopicPageHandler extends BaseAuthRequestHandler {
    constructor(private fintTopicApp: FindTopicApp) {
        super();
    }

    async performHandling(req: IAuthRequest, res: Response) {
        const { 'page-query': pageQuery, 'page-size': pageSize, 'page-index': pageIndex } = req.headers;
        const result = await this.fintTopicApp.find(
            req.auth.token, 
            new FeedbackQuery(
                pageQuery as string | undefined,
                parseInt(pageSize as string), 
                parseInt(pageIndex as string))
        );
        res.status(200).send(new TopicPageView(result));
    }
}