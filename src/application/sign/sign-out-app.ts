import { Inject, Service } from "typedi";
import { ExpiredRefreshTokenError } from "../../domain/token/data/expired-refresh-token-error";
import { InvalidRefreshTokenError } from "../../domain/token/data/invalid-refresh-token-error";
import { JwToken } from "../../domain/token/entity/jw-token";
import { IJwTokenCmdRepository } from "../../domain/token/repository/jw-token-cmd-repository";
import { IoCId } from "../../ioc/ioc-id";

@Service()
export class SignOutApp {
    constructor(
        @Inject(IoCId.Infra.JW_TOKEN_CMD_REPOSITORY)
        private jwTokenRepository: IJwTokenCmdRepository
    ) { }

    async signOut(refreshToken: JwToken): Promise<void> {
        if (!refreshToken.isValid) {
            throw new InvalidRefreshTokenError();
        }
        if (refreshToken.isExpired) {
            throw new ExpiredRefreshTokenError();
        }
        await this.jwTokenRepository.removeRefreshToken(refreshToken);
    }
}