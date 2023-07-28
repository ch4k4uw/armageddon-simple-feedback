import { JwAccessTokenPayloadModel } from "./model/jw-access-token-payload-model";
import { JwRefreshTokenPayloadModel } from "./model/jw-refresh-token-payload-model";
import { JwTopicIdMetadataPayloadModel } from "./model/jw-topic-id-metadata-payload-model";

export interface IJwTokenService {
    createAccessToken(payload: JwAccessTokenPayloadModel): Promise<string>;
    createRefreshToken(payload: JwRefreshTokenPayloadModel): Promise<string>;
    verifyAccessToken(raw: string): Promise<JwAccessTokenPayloadModel>;
    verifyRefreshToken(raw: string): Promise<JwRefreshTokenPayloadModel>;
    createTopicIdMetadataToken(payload: JwTopicIdMetadataPayloadModel): Promise<string>;
    verifyTopicIdMetadataToken(raw: string): Promise<JwTopicIdMetadataPayloadModel>;
}