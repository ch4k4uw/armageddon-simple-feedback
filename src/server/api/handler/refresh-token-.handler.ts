import { Response } from "express";
import { Service } from "typedi";
import { RefreshTokenApp } from "../../../application/token/refresh-token-app";
import { IAuthRequest } from "../common/req-auth";
import { BaseAuthRequestHandler } from "./base-auth-request.handler";

@Service()
export class RefreshTokenHandler extends BaseAuthRequestHandler {
    constructor(private refreshTokenApp: RefreshTokenApp) {
        super();
    }

    async performHandling(req: IAuthRequest, res: Response) {
        const result = await this.refreshTokenApp.refresh(req.auth.token);
        res.status(200).send(result);
    }
}