import { Request } from "express";
import Joi, { optional } from "joi";
import { Service } from "typedi";
import { BaseValidator } from "./base-validator";

@Service()
export class RequestPageHeaderValidator extends BaseValidator {
    readonly expression = Joi.object().keys({
        'page-query': Joi.string().optional(),
        'page-size': Joi.number().default(10),
        'page-index': Joi.number().default(1),
    }).unknown(true);

    readonly parseRequest = (req: Request) => req.headers;

    updateRequest(req: Request, value: any) {
        req.headers = value;
    }
}