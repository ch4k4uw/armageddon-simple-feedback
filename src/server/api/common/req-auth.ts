import { Request } from "express";
import { JwToken } from "../../../domain/token/entity/jw-token";

export interface IAuthToken {
    token: JwToken;
    rawToken: string;
}

export interface IAuthRequest<P = any, ReqBody = any> extends Request<P, any, ReqBody> {
    auth: IAuthToken; 
}