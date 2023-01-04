import { Request, Response } from "express";
import { Service } from "typedi";
import { FindLoggedUserApp } from "../../../application/user/find-logged-user-app";
import { IAuthRequest } from "../common/req-auth";
import { BaseAuthRequestHandler } from "./base-auth-request.handler";

@Service()
export class RequestLoggedUserHandler extends BaseAuthRequestHandler {
    constructor(private findLoggedUserApp: FindLoggedUserApp) {
        super();
    }

    async performHandling(req: IAuthRequest, res: Response) {
        const result = await this.findLoggedUserApp.find(req.auth.token);
        res.status(200).send(result);
    }
}