import { Response } from "express";
import { Service } from "typedi";
import { FindTopicSummaryByIdApp } from "../../../application/feedback/topic/find-topic-summary-by-id-app";
import { IAuthRequest } from "../common/req-auth";
import { BaseAuthRequestHandler } from "./base-auth-request.handler";
import { TopicSummaryView } from "./insteraction/topic-summary-view";

@Service()
export class RequestTopicSummaryByIdHandler extends BaseAuthRequestHandler {
    constructor(private findTopicSummaryByIdApp: FindTopicSummaryByIdApp) {
        super();
    }
    async performHandling(req: IAuthRequest<{ id: string }>, res: Response): Promise<void> {
        const result = await this.findTopicSummaryByIdApp.find(req.auth.token, req.params.id);
        res.status(200).send(new TopicSummaryView(result));
    }
}