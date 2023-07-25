import { Request } from "express";
import { Response } from "express-serve-static-core";
import { Service } from "typedi";
import { FindTopicByTopicIdMetadataApp } from "../../../application/feedback/topic/find-topic-by-topic-id-metadata-app";
import { BaseRequestHandler } from "./base-request.handler";
import { TopicView } from "./insteraction/topic-view";

@Service()
export class RequestTopicByTopicIdMetadataHandler extends BaseRequestHandler {
    constructor(private findTopicByIdMetadatApp: FindTopicByTopicIdMetadataApp) {
        super();
    }

    async performHandling(req: Request<{id: string}>, res: Response) {
        const result = await this.findTopicByIdMetadatApp.find(req.params.id);
        res.status(200).send(new TopicView(result));
    }
}