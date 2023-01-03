import { Request, Response } from "express";
import { Service } from "typedi";
import { SignInApp } from "../../../application/sign/sign-in-app";
import { BaseRequestHandler } from "./base-request.handler";

@Service()
export class RequestTokenHandler extends BaseRequestHandler {
    constructor(private signInApp: SignInApp) {
        super();
    }

    async performHandling(req: Request<any, any, { user: string, pass: string }>, res: Response) {
        const { user, pass } = req.body;
        const result = await this.signInApp.signIn(user, pass);
        res.status(201).send(result);
    }
}