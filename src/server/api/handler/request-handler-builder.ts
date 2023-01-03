import { RequestHandler } from "express";
import { Service } from "typedi";
import { BaseRequestHandler } from "./base-request.handler";

@Service()
export class RequestHandlerBuilder {
    build(handler: BaseRequestHandler): RequestHandler {
        return (req, res, next) => {
            handler.handle(req, res, next);
        };
    }
}