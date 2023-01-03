import { NextFunction, Request, Response } from "express";
import { IReqAuth, IReqToken } from "../common/req-auth";

export abstract class BaseRequestHandler {
    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.performHandling(req, res);
        } catch (e) {
            next(e);
        }
    }

    protected assertReqTokenFromRequest(req: Request): IReqToken {
        const auth = req as IReqAuth;
        if (!auth.token) {
            throw new Error('missing token');
        }
        return auth.token;
    }

    protected abstract performHandling(req: Request, res: Response): Promise<void>;
}