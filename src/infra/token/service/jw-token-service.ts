import { JwAccessTokenPayloadModel } from "./model/jw-access-token-payload-model";
import { JwRefreshTokenPayloadModel } from "./model/jw-refresh-token-payload-model";

export interface IJwTokenService {
    createAccessToken(payload: JwAccessTokenPayloadModel): Promise<string>;
    createRefreshToken(payload: JwRefreshTokenPayloadModel): Promise<string>;
    verifyAccessToken(raw: string): Promise<JwAccessTokenPayloadModel>;
    verifyRefreshToken(raw: string): Promise<JwRefreshTokenPayloadModel>;
}