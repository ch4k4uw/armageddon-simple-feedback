import { Request } from "express";
import Joi, { optional } from "joi";
import { Service } from "typedi";
import { BaseValidator } from "./base-validator";

@Service()
export class RegisterOrUpdateTopicBodyValidator extends BaseValidator {
    readonly expression = Joi.object().keys({
        title: Joi.string().trim().required(),
        description: Joi.string().trim().required(),
        expiration: Joi.number().required(),
    });

    readonly parseRequest = (req: Request) => req.body;
}