import { Response } from "express";
import { Service } from "typedi";
import { TopicRegistration } from "../../../application/feedback/topic/data/topic-registration";
import { RegisterTopicApp } from "../../../application/feedback/topic/register-topic-app";
import { Topic } from "../../../domain/feedback/entity/topic";
import { IAuthRequest } from "../common/req-auth";
import { BaseAuthRequestHandler } from "./base-auth-request.handler";
import { IRegisterTopicView } from "./insteraction/register-topic-view";
import { TopicView } from "./insteraction/topic-view";

@Service()
export class RegisterTopicHandler extends BaseAuthRequestHandler {
    constructor(private registerTopicApp: RegisterTopicApp) {
        super();
    }

    async performHandling(req: IAuthRequest<any, IRegisterTopicView>, res: Response) {
        const data = new TopicRegistration(req.body.title, req.body.description, new Date(req.body.expiration));
        const result = await this.registerTopicApp.register(req.auth.token, data);
        res.status(201).send(new TopicView(result));
    }
}