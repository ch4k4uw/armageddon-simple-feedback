import { Request } from "express";
import Joi, { optional } from "joi";
import { Service } from "typedi";
import { BaseValidator } from "./base-validator";
import { TopicConstants } from "../../../domain/feedback/data/topic-constants";

@Service()
export class RegisterOrUpdateTopicBodyValidator extends BaseValidator {
    readonly expression = Joi.object().keys({
        title: Joi.string().max(TopicConstants.maxTopicTitleLength).trim().required(),
        description: Joi.string().max(TopicConstants.maxTopicDescriptionLength).trim().required(),
        expiration: Joi.number().required(),
    });

    readonly parseRequest = (req: Request) => req.body;
}