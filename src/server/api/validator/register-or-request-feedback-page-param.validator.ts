import { Request } from "express";
import Joi from "joi";
import { Service } from "typedi";
import { BaseValidator } from "./base-validator";

@Service()
export class RegisterOrRequestFeedbackPageParamValidator extends BaseValidator {
    readonly expression = Joi.object().keys({
        topic: Joi.string().required()
    });

    readonly parseRequest = (req: Request) => req.params;
}