import { NextFunction, Request, Response } from "express";

export abstract class BaseRequestHandler {
    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.performHandling(req, res);
        } catch (e) {
            next(e);
        }
    }

    protected abstract performHandling(req: Request, res: Response): Promise<void>;
}