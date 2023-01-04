import { Request } from "express";
import { Response } from "express-serve-static-core";
import { Service } from "typedi";
import { FindTopicByCodeApp } from "../../../application/feedback/topic/find-topic-by-code-app";
import { BaseRequestHandler } from "./base-request.handler";
import { TopicView } from "./insteraction/topic-view";

@Service()
export class RequestTopicByCodeHandler extends BaseRequestHandler {
    constructor(private findTopicByCodeApp: FindTopicByCodeApp) {
        super();
    }

    async performHandling(req: Request<{code: string}>, res: Response) {
        const result = await this.findTopicByCodeApp.find(req.params.code);
        res.status(200).send(new TopicView(result));
    }
}