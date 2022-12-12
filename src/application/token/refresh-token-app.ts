import { ExpiredRefreshTokenError } from "../../domain/token/data/expired-refresh-token-error";
import { InvalidRefreshTokenError } from "../../domain/token/data/invalid-refresh-token-error";
import { JwToken } from "../../domain/token/entity/jw-token";
import { RawJwToken } from "../../domain/token/data/raw-jw-token";
import { IJwTokenCmdRepository } from "../../domain/token/repository/jw-token-cmd-repository";

export class RefreshTokenApp {
    constructor(private jwTokenRepository: IJwTokenCmdRepository) { }
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