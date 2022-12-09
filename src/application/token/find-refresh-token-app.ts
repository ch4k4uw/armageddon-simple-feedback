import { InvalidRefreshTokenError } from "../../domain/token/data/invalid-refresh-token-error";
import { JwToken } from "../../domain/token/data/jw-token";
import { RawJwToken } from "../../domain/token/data/raw-jw-token";
import { IJwTokenRepository } from "../../domain/token/repository/jw-token-repository";

export class FindRefreshTokenApp {
    constructor(private jwTokenRepository: IJwTokenRepository) { }
    async find(rawJwToken: RawJwToken): Promise<JwToken> {
        rawJwToken.assertRefreshToken();
        const result = await this.jwTokenRepository.findRefreshTokenByRaw(rawJwToken);
        return result;
    }
}

declare module "../../domain/token/data/raw-jw-token" {
    interface RawJwToken {
        assertRefreshToken(): void;
    }
}

RawJwToken.prototype.assertRefreshToken = function () {
    if (!this.isRefreshToken) {
        throw new InvalidRefreshTokenError();
    }
}