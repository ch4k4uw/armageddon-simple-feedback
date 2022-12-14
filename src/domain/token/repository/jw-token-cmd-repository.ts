import { JwToken } from "../entity/jw-token";
import { RawJwToken } from "../data/raw-jw-token";
import { IJwTokenRepository } from "./jw-token-repository";

export interface IJwTokenCmdRepository extends IJwTokenRepository {
    insert(token: JwToken): Promise<RawJwToken>;
    updateAccessToken(token: JwToken): Promise<RawJwToken>;
    removeRefreshToken(token: JwToken): Promise<void>;
}