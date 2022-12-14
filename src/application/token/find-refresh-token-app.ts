import { InvalidRefreshTokenError } from "../../domain/token/data/invalid-refresh-token-error";
import { JwToken } from "../../domain/token/entity/jw-token";
import { RawJwToken } from "../../domain/token/data/raw-jw-token";
import { IJwTokenRepository } from "../../domain/token/repository/jw-token-repository";

export class FindRefreshTokenApp {
    constructor(private jwTokenRepository: IJwTokenRepository) { }
    async find(rawJwToken: RawJwToken): Promise<JwToken> {
        this.assertRefreshToken(rawJwToken);
        const result = await this.jwTokenRepository.findRefreshTokenByRaw(rawJwToken);
        return result;
    }

    private assertRefreshToken(token: RawJwToken) {
        if (!token.isRefreshToken) {
            throw new InvalidRefreshTokenError();
        }
    }
}