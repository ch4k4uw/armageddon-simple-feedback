import { RequestHandler } from "express";
import { Service } from "typedi";
import { IAuthRequest } from "../common/req-auth";
import { BaseAuthRequestHandler } from "./base-auth-request.handler";
import { BaseRequestHandler } from "./base-request.handler";

@Service()
export class RequestHandlerBuilder {
    build(handler: BaseRequestHandler): RequestHandler {
        return (req, res, next) => {
            if (handler instanceof BaseAuthRequestHandler) {
                const authReq = req as IAuthRequest;
                if (!authReq.auth) {
                    throw new Error("missing 'auth' field for handler");
                }
            }
            handler.handle(req, res, next);
        };
    }
}