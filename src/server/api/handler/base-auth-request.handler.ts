import { NextFunction, Request, Response } from "express";
import { IAuthRequest, IAuthToken } from "../common/req-auth";
import { BaseRequestHandler } from "./base-request.handler";

export abstract class BaseAuthRequestHandler extends BaseRequestHandler {
    protected abstract performHandling(req: IAuthRequest, res: Response): Promise<void>;
}