import { ExpiredRefreshTokenError } from "../../domain/token/data/expired-refresh-token-error";
import { InvalidRefreshTokenError } from "../../domain/token/data/invalid-refresh-token-error";
import { JwToken } from "../../domain/token/data/jw-token";
import { RawJwToken } from "../../domain/token/data/raw-jw-token";
import { IJwTokenCmdRepository } from "../../domain/token/repository/jw-token-cmd-repository";

export class RefreshTokenApp {
    constructor(private jwTokenRepository: IJwTokenCmdRepository) { }
    async refresh(token: JwToken): Promise<RawJwToken> {
        token.assertRefreshToken();
        const result = await this.jwTokenRepository.updateAccessToken(token);
        return result;
    }
}

declare module "../../domain/token/data/jw-token" {
    interface JwToken {
        assertRefreshToken(): void;
    }
}

JwToken.prototype.assertRefreshToken = function () {
    if (!this.isValid) {
        throw new InvalidRefreshTokenError();
    }

    if (this.isExpired) {
        throw new ExpiredRefreshTokenError();
    }
}