import { Request } from "express";
import Joi from "joi";
import { Service } from "typedi";
import { BaseValidator } from "./base-validator";

@Service()
export class RequestTokenBodyValidator extends BaseValidator {
    readonly expression = Joi.object().keys({
        user: Joi.string().required(),
        pass: Joi.string().required()
    });

    readonly parseRequest = (req: Request) => req.body;
}