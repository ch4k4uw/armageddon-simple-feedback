import { Response } from "express";
import { Service } from "typedi";
import { FindFeedbackByIdApp } from "../../../application/feedback/feedback/find-feedback-by-id-app";
import { IAuthRequest } from "../common/req-auth";
import { BaseAuthRequestHandler } from "./base-auth-request.handler";

@Service()
export class RequestFeedbackByIdHandler extends BaseAuthRequestHandler {
    constructor(private findFeedbackById: FindFeedbackByIdApp) {
        super();
    }
    async performHandling(req: IAuthRequest<{id: string}>, res: Response): Promise<void> {
        const result = await this.findFeedbackById.find(req.auth.token, req.params.id);
        res.status(200).send(result);
    }
}