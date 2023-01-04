import { Request } from "express";
import Joi, { optional } from "joi";
import { Service } from "typedi";
import { FeedbackConstants } from "../../../domain/feedback/data/feedback-constants";
import { BaseValidator } from "./base-validator";

@Service()
export class RegisterFeedbackBodyValidator extends BaseValidator {
    readonly expression = Joi.object().keys({
        rating: Joi.number().allow(1, 2, 3, 4, 5).required(),
        reason: Joi.string().max(FeedbackConstants.maxFeedbackReasonLength).optional(),
    });

    readonly parseRequest = (req: Request) => req.body;
}