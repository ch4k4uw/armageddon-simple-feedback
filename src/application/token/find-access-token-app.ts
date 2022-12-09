import { InvalidAccessTokenError } from "../../domain/token/data/invalid-access-token-error";
import { JwToken } from "../../domain/token/data/jw-token";
import { RawJwToken } from "../../domain/token/data/raw-jw-token";
import { IJwTokenRepository } from "../../domain/token/repository/jw-token-repository";

export class FindAccessTokenApp {
    constructor(private jwTokenRepository: IJwTokenRepository) { }
    async find(rawJwToken: RawJwToken): Promise<JwToken> {
        rawJwToken.assertAccessToken();
        const result = await this.jwTokenRepository.findAccessTokenByRaw(rawJwToken);
        return result;
    }
}

declare module "../../domain/token/data/raw-jw-token" {
    interface RawJwToken {
        assertAccessToken(): void;
    }
}

RawJwToken.prototype.assertAccessToken = function () {
    if (!this.isAccessToken) {
        throw new InvalidAccessTokenError();
    }
}