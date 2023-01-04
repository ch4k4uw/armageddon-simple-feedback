import { Response } from "express";
import { Service } from "typedi";
import { FeedbackQuery } from "../../../application/feedback/common/data/feedback-query";
import { FindFeedbackApp } from "../../../application/feedback/feedback/find-feedback-app";
import { IAuthRequest } from "../common/req-auth";
import { BaseAuthRequestHandler } from "./base-auth-request.handler";

@Service()
export class RequestFeedbackPageHandler extends BaseAuthRequestHandler {
    constructor(private findFeedback: FindFeedbackApp) { 
        super();
    }
    async performHandling(req: IAuthRequest<{ topic: string }>, res: Response): Promise<void> {
        const { 'page-query': pageQuery, 'page-size': pageSize, 'page-index': pageIndex } = req.headers;
        const topic = req.params.topic;

        const result = await this.findFeedback.find(
            req.auth.token, 
            topic, 
            new FeedbackQuery(
                pageQuery as string | undefined,
                parseInt(pageSize as string), 
                parseInt(pageIndex as string)
            )
        );

        res.status(200).send(result);
    }
}