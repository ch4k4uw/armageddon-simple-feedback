import { Request, Response } from "express";
import { Service } from "typedi";
import { FeedbackRegistration } from "../../../application/feedback/feedback/data/feedback-registration";
import { RegisterFeedbackApp } from "../../../application/feedback/feedback/register-feedback-app";
import { BaseRequestHandler } from "./base-request.handler";
import { IFeedbackRegistrationView } from "./insteraction/feedback-registration-view";

@Service()
export class RegisterFeedbackHandler extends BaseRequestHandler {
    constructor(private registerFeedbackApp: RegisterFeedbackApp) {
        super();
    }

    async performHandling(req: Request<{topic: string}, any, IFeedbackRegistrationView>, res: Response) {
        const data = new FeedbackRegistration(req.params.topic, req.body.rating, req.body.reason);
        const result = await this.registerFeedbackApp.register(data);
        res.status(201).send(result);
    }
}