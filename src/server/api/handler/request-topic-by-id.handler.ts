import { Response } from "express-serve-static-core";
import { Service } from "typedi";
import { FindTopicByIdApp } from "../../../application/feedback/topic/find-topic-by-id-app";
import { IAuthRequest } from "../common/req-auth";
import { BaseAuthRequestHandler } from "./base-auth-request.handler";
import { TopicView } from "./insteraction/topic-view";

@Service()
export class RequestTopicByIdHandler extends BaseAuthRequestHandler {
    constructor(private findTopicByIdApp: FindTopicByIdApp) {
        super();
    }

    async performHandling(req: IAuthRequest<{id: string}>, res: Response) {
        const result = await this.findTopicByIdApp.find(req.auth.token, req.params.id);
        res.status(200).send(new TopicView(result));
    }
}