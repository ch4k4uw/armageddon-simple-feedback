import { JwToken } from "../../../domain/token/entity/jw-token";

export interface IReqToken {
    token: JwToken;
    raw: string;
}

export interface IReqAuth {
    token?: IReqToken;
}