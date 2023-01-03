import { RequestHandler } from "express";
import { Service } from "typedi";
import { BaseValidator } from "./base-validator";

@Service()
export class ValidatorBuilder {
    build(validator: BaseValidator): RequestHandler {
        return (req, res, next) => {
            validator.validate(req, res, next);
        }
    }
}