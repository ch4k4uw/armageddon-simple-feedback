import { UserNotFoundError } from "../../../domain/common/data/user-not-found-error";
import { InvalidRefreshTokenError } from "../../../domain/token/data/invalid-refresh-token-error";
import { RawJwToken } from "../../../domain/token/data/raw-jw-token";
import { JwToken } from "../../../domain/token/entity/jw-token";
import { IJwTokenCmdRepository } from "../../../domain/token/repository/jw-token-cmd-repository";
import { IDatabase } from "../../database/database";
import { JwRefreshTokenModel } from "../../database/model/jw-refresh-token-model";
import { IJwTokenService } from "../service/jw-token-service";
import { JwAccessTokenPayloadModel } from "../service/model/jw-access-token-payload-model";
import { JwRefreshTokenPayloadModel } from "../service/model/jw-refresh-token-payload-model";

export class JwTokenCmdRepositoryImpl implements IJwTokenCmdRepository {
    constructor(
        private database: IDatabase,
        private jwTokenSvc: IJwTokenService,
    ) { }

    async insert(token: JwToken): Promise<RawJwToken> {
        const id = await this.database.createId();
        const result = this.createTokens(id, token);

        const userModel = await this.database.findUserById(token.loggedUser.id);
        if (userModel === null) {
            throw new UserNotFoundError();
        }
        const now = this.database.dateTime;
        const tokenModel = new JwRefreshTokenModel(
            id, userModel, false, now, now
        );

        await this.database.insertJwRefreshToken(tokenModel);

        return result;
    }

    private async createTokens(id: string, token: JwToken): Promise<RawJwToken> {
        const accessTokenPayload = new JwAccessTokenPayloadModel(
            token.loggedUser
        );
        const refreshTokenPayload = new JwRefreshTokenPayloadModel(
            id, token.loggedUser
        );
        const rawAccessToken = await this.jwTokenSvc.createAccessToken(accessTokenPayload);
        const rawRefreshToken = await this.jwTokenSvc.createRefreshToken(refreshTokenPayload);
        return new RawJwToken(
            rawAccessToken, rawRefreshToken
        );
    }

    async updateAccessToken(token: JwToken): Promise<RawJwToken> {
        const id = await this.database.createId();
        const result = this.createTokens(id, token);

        const jwRefreshTokenModel = await this.database.findJwRefreshToken(token.id);
        if (jwRefreshTokenModel === null || jwRefreshTokenModel.removed) {
            throw new InvalidRefreshTokenError();
        }

        const userModel = await this.database.findUserById(jwRefreshTokenModel.user.id);
        if (userModel === null) {
            throw new UserNotFoundError();
        }

        const now = this.database.dateTime;
        const newTokenModel = new JwRefreshTokenModel(id, userModel, false, jwRefreshTokenModel.created, now);
        const oldTokenModel = jwRefreshTokenModel.toRemoved(now);

        await this.database.insertAndUpdateRefreshToken(newTokenModel, oldTokenModel);

        return result;
    }

    async removeRefreshToken(token: JwToken): Promise<void> {
        const jwRefreshTokenModel = await this.database.findJwRefreshToken(token.id);
        if (jwRefreshTokenModel === null || jwRefreshTokenModel.removed) {
            throw new InvalidRefreshTokenError();
        }
        await this.database.updateJwRefreshToken(
            jwRefreshTokenModel.toRemoved(this.database.dateTime)
        );
    }

    async findAccessTokenByRaw(raw: RawJwToken): Promise<JwToken> {
        const token = await this.jwTokenSvc.verifyAccessToken(raw.accessToken);
        return new JwToken(token.loggedUser.id, token.loggedUser, false, true);
    }

    async findRefreshTokenByRaw(raw: RawJwToken): Promise<JwToken> {
        const token = await this.jwTokenSvc.verifyRefreshToken(raw.refreshToken);
        const jwRefreshTokenModel = await this.database.findJwRefreshToken(token.id);
        if (jwRefreshTokenModel === null || jwRefreshTokenModel.removed) {
            throw new InvalidRefreshTokenError();
        }

        const userModel = await this.database.findUserById(jwRefreshTokenModel.user.id);
        if (userModel === null) {
            throw new UserNotFoundError();
        }

        return new JwToken(
            jwRefreshTokenModel.id, token.loggedUser, false, true
        );
    }

}