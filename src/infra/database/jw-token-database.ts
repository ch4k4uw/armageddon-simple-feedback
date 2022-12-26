import { JwRefreshTokenModel } from "./model/jw-refresh-token-model";

export interface IJwTokenDatabase {
    insertJwRefreshToken(token: JwRefreshTokenModel): Promise<void>;
    insertAndUpdateRefreshToken(insert: JwRefreshTokenModel, update: JwRefreshTokenModel): Promise<void>;
    findJwRefreshToken(id: string): Promise<JwRefreshTokenModel|null>;
    updateJwRefreshToken(token: JwRefreshTokenModel): Promise<void>;
}