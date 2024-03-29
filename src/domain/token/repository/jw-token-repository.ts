import { JwToken } from "../entity/jw-token";
import { RawJwToken } from "../data/raw-jw-token";

export interface IJwTokenRepository {
    findAccessTokenByRaw(raw: RawJwToken): Promise<JwToken>;
    findRefreshTokenByRaw(raw: RawJwToken): Promise<JwToken>;
}