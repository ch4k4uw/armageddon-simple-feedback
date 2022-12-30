import { Inject, Service } from "typedi";
import { ExpiredRefreshTokenError } from "../../domain/token/data/expired-refresh-token-error";
import { InvalidRefreshTokenError } from "../../domain/token/data/invalid-refresh-token-error";
import { RawJwToken } from "../../domain/token/data/raw-jw-token";
import { JwToken } from "../../domain/token/entity/jw-token";
import { IJwTokenCmdRepository } from "../../domain/token/repository/jw-token-cmd-repository";
import { IoCId } from "../../ioc/ioc-id";

@Service()
export class RefreshTokenApp {
    constructor(
        @Inject(IoCId.Infra.JW_TOKEN_CMD_REPOSITORY)
        private jwTokenRepository: IJwTokenCmdRepository
    ) { }
    async refresh(token: JwToken): Promise<RawJwToken> {
        this.assertRefreshToken(token);
        const result = await this.jwTokenRepository.updateAccessToken(token);
        return result;
    }

    private assertRefreshToken(token: JwToken) {
        if (!token.isValid) {
            throw new InvalidRefreshTokenError();
        }
    
        if (token.isExpired) {
            throw new ExpiredRefreshTokenError();
        }
    }
}