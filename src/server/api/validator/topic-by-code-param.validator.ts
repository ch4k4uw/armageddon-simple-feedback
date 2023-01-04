import { Request } from "express";
import Joi from "joi";
import { Service } from "typedi";
import { BaseValidator } from "./base-validator";

@Service()
export class TopicByCodeParamValidator extends BaseValidator {
    readonly expression = Joi.object().keys({
        code: Joi.string().required()
    });

    readonly parseRequest = (req: Request) => req.params;
}