import { Request } from "express";
import Joi, { optional } from "joi";
import { Service } from "typedi";
import { BaseValidator } from "./base-validator";

@Service()
export class RequestTopicByTopicIdMetadataParamValidator extends BaseValidator {
    readonly expression = Joi.object().keys({
        id: Joi.string().required(),
    }).unknown(true);

    readonly parseRequest = (req: Request) => req.params;
}