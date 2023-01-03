import { Request, Response } from "express";
import { Service } from "typedi";
import { RefreshTokenApp } from "../../../application/token/refresh-token-app";
import { BaseRequestHandler } from "./base-request.handler";

@Service()
export class RefreshTokenHandler extends BaseRequestHandler {
    constructor(private refreshTokenApp: RefreshTokenApp) {
        super();
    }

    async performHandling(req: Request, res: Response) {
        const token = this.assertReqTokenFromRequest(req);
        const result = await this.refreshTokenApp.refresh(token.token);
        res.status(200).send(result);
    }
}