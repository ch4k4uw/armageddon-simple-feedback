import { LoggedUser } from "../../../../src/domain/common/entity/logged-user";
import { Role } from "../../../../src/domain/credential/data/role";
import { ExpiredAccessTokenError } from "../../../../src/domain/token/data/expired-access-token-error";
import { ExpiredRefreshTokenError } from "../../../../src/domain/token/data/expired-refresh-token-error";
import { InvalidAccessTokenError } from "../../../../src/domain/token/data/invalid-access-token-error";
import { InvalidRefreshTokenError } from "../../../../src/domain/token/data/invalid-refresh-token-error";
import { JwTokenKeyProviderImpl } from "../../../../src/infra/token/service/jw-token-key-provider-impl";
import { IJwTokenService } from "../../../../src/infra/token/service/jw-token-service";
import { JwTokenServiceImpl } from "../../../../src/infra/token/service/jw-token-service-impl";
import { JwAccessTokenPayloadModel } from "../../../../src/infra/token/service/model/jw-access-token-payload-model";
import { JwRefreshTokenPayloadModel } from "../../../../src/infra/token/service/model/jw-refresh-token-payload-model";
import { reject } from "../../../util/framework";

describe('Jw Token Service tests', () => {
    let svc: IJwTokenService;

    beforeEach(() => {
        svc = new JwTokenServiceImpl(new JwTokenKeyProviderImpl());
    });

    test('should encode an access token', async () => {
        const payload = new JwAccessTokenPayloadModel(
            new LoggedUser("a", "b", [Role.admin])
        );
        const result = await svc.createAccessToken(payload);
        expect(result).not.toEqual("");
    });

    test('should encode a refresh token', async () => {
        const payload = new JwRefreshTokenPayloadModel(
            "c",
            new LoggedUser("a", "b", [Role.admin])
        );
        const result = await svc.createRefreshToken(payload);
        expect(result).not.toEqual("");
    });

    test('should dencode an access token', async () => {
        const user = new LoggedUser("a", "b", [Role.admin]);
        const payload = new JwAccessTokenPayloadModel(user);
        const rawToken = await svc.createAccessToken(payload);
        const decodedToken = await svc.verifyAccessToken(rawToken);
        expect(decodedToken).toEqual({ ...payload });
        expect(decodedToken).toBeInstanceOf(JwAccessTokenPayloadModel);
        expect(decodedToken.loggedUser).toBeInstanceOf(LoggedUser);
    });

    test('should dencode a refresh token', async () => {
        const user = new LoggedUser("a", "b", [Role.admin]);
        const payload = new JwRefreshTokenPayloadModel("c", user);
        const rawToken = await svc.createRefreshToken(payload);
        const decodedToken = await svc.verifyRefreshToken(rawToken);
        expect(decodedToken).toEqual({ ...payload });
        expect(decodedToken).toBeInstanceOf(JwRefreshTokenPayloadModel);
        expect(decodedToken.loggedUser).toBeInstanceOf(LoggedUser);
    });

    reject('should reject with invalid access token error', async () => {
        await svc.verifyAccessToken("xxx");
    }, (err) => {
        expect(err).toBeInstanceOf(InvalidAccessTokenError);
    });

    reject('should reject with invalid refresh token error', async () => {
        await svc.verifyRefreshToken("xxx");
    }, (err) => {
        expect(err).toBeInstanceOf(InvalidRefreshTokenError);
    });

    reject('should reject with expired access token error', async () => {
        process.env.ARMAGEDDON_ACCESS_TOKEN_EXPIRATION = '-30m';
        const user = new LoggedUser("a", "b", [Role.admin]);
        const payload = new JwAccessTokenPayloadModel(user);
        const rawToken = await svc.createAccessToken(payload);
        await svc.verifyAccessToken(rawToken);
    }, (err) => {
        expect(err).toBeInstanceOf(ExpiredAccessTokenError);
    });

    reject('should reject with expired refresh token error', async () => {
        process.env.ARMAGEDDON_REFRESH_TOKEN_EXPIRATION = '-30m';
        const user = new LoggedUser("a", "b", [Role.admin]);
        const payload = new JwRefreshTokenPayloadModel("c", user);
        const rawToken = await svc.createRefreshToken(payload);
        await svc.verifyRefreshToken(rawToken);
    }, (err) => {
        expect(err).toBeInstanceOf(ExpiredRefreshTokenError);
    });
});