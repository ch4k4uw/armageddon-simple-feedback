import { anything, instance, mock, verify, when } from "ts-mockito";
import { RefreshTokenApp } from "../../../src/application/token/refresh-token-app";
import { ExpiredRefreshTokenError } from "../../../src/domain/token/data/expired-refresh-token-error";
import { InvalidRefreshTokenError } from "../../../src/domain/token/data/invalid-refresh-token-error";
import { IJwTokenCmdRepository } from "../../../src/domain/token/repository/jw-token-cmd-repository";
import { reject } from "../../util/framework";
import { TokenFixture } from "./stuff/token-fixture";

describe('Refresh token tests', () => {
    let svc: RefreshTokenApp;
    let jwTokenRepository: IJwTokenCmdRepository;

    beforeEach(() => {
        jwTokenRepository = mock<IJwTokenCmdRepository>();
        setupJwTokenRepository();

        svc = new RefreshTokenApp(instance(jwTokenRepository));
    });

    function setupJwTokenRepository() {
        when(jwTokenRepository.updateAccessToken(anything())).thenResolve(TokenFixture.Refreshing.successRawJwToken);
    }

    test('should refresh a token', async () => {
        const result = await svc.refresh(TokenFixture.Refreshing.successJwToken);
        verify(jwTokenRepository.updateAccessToken(anything())).once();
        expect(result).toEqual({ ...TokenFixture.Refreshing.successRawJwToken });
    });

    reject('should reject with invalid refresh token', async () => {
        await svc.refresh(TokenFixture.Refreshing.invalidJwToken);
    }, (err) => {
        expect(err).toBeInstanceOf(InvalidRefreshTokenError);
        verify(jwTokenRepository.updateAccessToken(anything())).never();
    });

    reject('should reject with expired refresh token', async () => {
        await svc.refresh(TokenFixture.Refreshing.expiredJwToken);
    }, (err) => {
        expect(err).toBeInstanceOf(ExpiredRefreshTokenError);
        verify(jwTokenRepository.updateAccessToken(anything())).never();
    });
});