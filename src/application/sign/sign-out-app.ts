import { ExpiredRefreshTokenError } from "../../domain/token/data/expired-refresh-token-error";
import { InvalidRefreshTokenError } from "../../domain/token/data/invalid-refresh-token-error";
import { JwToken } from "../../domain/token/data/jw-token";
import { IJwTokenCmdRepository } from "../../domain/token/repository/jw-token-cmd-repository";

export class SignOutApp {
    constructor(
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