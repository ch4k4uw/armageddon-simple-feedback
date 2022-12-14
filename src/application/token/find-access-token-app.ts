import { InvalidAccessTokenError } from "../../domain/token/data/invalid-access-token-error";
import { JwToken } from "../../domain/token/entity/jw-token";
import { RawJwToken } from "../../domain/token/data/raw-jw-token";
import { IJwTokenRepository } from "../../domain/token/repository/jw-token-repository";

export class FindAccessTokenApp {
    constructor(private jwTokenRepository: IJwTokenRepository) { }
    async find(rawJwToken: RawJwToken): Promise<JwToken> {
        this.assertAccessToken(rawJwToken);
        const result = await this.jwTokenRepository.findAccessTokenByRaw(rawJwToken);
        return result;
    }

    private assertAccessToken(token: RawJwToken) {
        if (!token.isAccessToken) {
            throw new InvalidAccessTokenError();
        }
    }
}
