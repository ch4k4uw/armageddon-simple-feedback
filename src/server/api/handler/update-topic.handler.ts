import { Response } from "express";
import { Service } from "typedi";
import { TopicUpdate } from "../../../application/feedback/topic/data/topic-update";
import { UpdateTopicApp } from "../../../application/feedback/topic/update-topic-app";
import { IAuthRequest } from "../common/req-auth";
import { BaseAuthRequestHandler } from "./base-auth-request.handler";
import { ITopicRegisterView } from "./insteraction/topic-register-view";
import { TopicView } from "./insteraction/topic-view";

@Service()
export class UpdateTopicHandler extends BaseAuthRequestHandler {
    constructor(private updateTopicApp: UpdateTopicApp) { 
        super(); 
    }

    async performHandling(req: IAuthRequest<{id: string}, ITopicRegisterView>, res: Response): Promise<void> {
        const data = new TopicUpdate(req.params.id, req.body.title, req.body.description, new Date(req.body.expiration));
        const result = await this.updateTopicApp.update(req.auth.token, data);
        res.status(200).send(new TopicView(result));
    }

}