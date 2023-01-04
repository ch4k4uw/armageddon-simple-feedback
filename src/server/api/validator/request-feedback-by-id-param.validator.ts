import { Request } from "express";
import Joi from "joi";
import { Service } from "typedi";
import { BaseValidator } from "./base-validator";

@Service()
export class RequestFeedbackByIdParamValidator extends BaseValidator {
    readonly expression = Joi.object().keys({
        id: Joi.string().required(),
    });

    readonly parseRequest = (req: Request) => req.params;
}