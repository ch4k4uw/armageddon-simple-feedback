import { Request, Response } from "express";
import { Service } from "typedi";
import { SignOutApp } from "../../../application/sign/sign-out-app";
import { BaseRequestHandler } from "./base-request.handler";

@Service()
export class RemoveTokenHandler extends BaseRequestHandler {
    constructor(private signOutApp: SignOutApp) {
        super();
    }

    async performHandling(req: Request, res: Response) {
        const token = this.assertReqTokenFromRequest(req);
        await this.signOutApp.signOut(token.token);
        res.status(200).send();
    }
}