import { Request } from "express";
import Joi from "joi";
import { Service } from "typedi";
import { BaseValidator } from "./base-validator";

@Service()
export class AuthorizationHeaderValidator extends BaseValidator {
    readonly expression = Joi.object().keys({
        authorization: Joi.string().regex(/Bearer .*/).required()
    }).unknown(true);

    readonly parseRequest = (req: Request) => req.headers;
}