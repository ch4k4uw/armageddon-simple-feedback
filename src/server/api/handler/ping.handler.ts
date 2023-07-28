import { Request, Response } from "express";
import { BaseRequestHandler } from "./base-request.handler";
import { Service } from "typedi";

@Service()
export class PingHandler extends BaseRequestHandler {
    constructor() {
        super();
    }
    protected async performHandling(req: Request, res: Response): Promise<void> {
        res.status(200).send({ result: "pong"});
    }
}