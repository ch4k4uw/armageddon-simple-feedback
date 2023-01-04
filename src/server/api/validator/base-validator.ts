import { NextFunction, Request, Response } from "express";
import * as Joi from "joi";

export abstract class BaseValidator {
    protected abstract readonly expression: Joi.AnySchema;
    validate(req: Request, _res: Response, next: NextFunction) {
        const { error, value } = this.expression.validate(this.parseRequest(req));
        const valid = error === undefined;
        if (valid) {
            if (value) {
                this.updateRequest(req, value);
            }
            next();
        } else {
            next(error);
        }
    }

    protected abstract parseRequest(req: Request): any;

    protected updateRequest(req: Request, value: any) {
    }
}