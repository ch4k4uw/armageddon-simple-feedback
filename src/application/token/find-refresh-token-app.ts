import { Inject, Service } from "typedi";
import { InvalidRefreshTokenError } from "../../domain/token/data/invalid-refresh-token-error";
import { RawJwToken } from "../../domain/token/data/raw-jw-token";
import { JwToken } from "../../domain/token/entity/jw-token";
import { IJwTokenRepository } from "../../domain/token/repository/jw-token-repository";
import { IoCId } from "../../ioc/ioc-id";

@Service()
export class FindRefreshTokenApp {
    constructor(
        @Inject(IoCId.Infra.JW_TOKEN_REPOSITORY)
        private jwTokenRepository: IJwTokenRepository
    ) { }
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