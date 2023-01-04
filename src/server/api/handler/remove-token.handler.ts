import { Response } from "express";
import { Service } from "typedi";
import { SignOutApp } from "../../../application/sign/sign-out-app";
import { IAuthRequest } from "../common/req-auth";
import { BaseAuthRequestHandler } from "./base-auth-request.handler";

@Service()
export class RemoveTokenHandler extends BaseAuthRequestHandler {
    constructor(private signOutApp: SignOutApp) {
        super();
    }

    async performHandling(req: IAuthRequest, res: Response) {
        await this.signOutApp.signOut(req.auth.token);
        res.status(200).send();
    }
}