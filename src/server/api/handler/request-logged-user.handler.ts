import { Request, Response } from "express";
import { Service } from "typedi";
import { FindLoggedUserApp } from "../../../application/user/find-logged-user-app";
import { BaseRequestHandler } from "./base-request.handler";

@Service()
export class RequestLoggedUserHandler extends BaseRequestHandler {
    constructor(private findLoggedUserApp: FindLoggedUserApp) {
        super();
    }

    async performHandling(req: Request<any, any, { user: string, pass: string }>, res: Response) {
        const token = this.assertReqTokenFromRequest(req);
        const result = await this.findLoggedUserApp.find(token.token);
        res.status(200).send(result);
    }
}