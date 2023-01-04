import { Response } from "express";
import { Service } from "typedi";
import { RemoveTopicApp } from "../../../application/feedback/topic/remove-topic-app";
import { IAuthRequest } from "../common/req-auth";
import { BaseAuthRequestHandler } from "./base-auth-request.handler";

@Service()
export class RemoveTopicHandler extends BaseAuthRequestHandler {
    constructor(private removeTopicApp: RemoveTopicApp) {
        super();
    }

    async performHandling(req: IAuthRequest<{id: string}>, res: Response) {
        const result = await this.removeTopicApp.remove(req.auth.token, req.params.id);
        res.status(200).send(result);
    }
}