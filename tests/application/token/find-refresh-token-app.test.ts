import { anything, instance, mock, verify, when } from "ts-mockito";
import { FindRefreshTokenApp } from "../../../src/application/token/find-refresh-token-app";
import { InvalidRefreshTokenError } from "../../../src/domain/token/data/invalid-refresh-token-error";
import { IJwTokenRepository } from "../../../src/domain/token/repository/jw-token-repository";
import { reject } from "../../util/framework";
import { TokenFixture } from "./stuff/token-fixture";

describe('Find refresh token tests', () => {
    let svc: FindRefreshTokenApp;
    let jwTokenRepository: IJwTokenRepository;

    beforeEach(() => {
        jwTokenRepository = mock<IJwTokenRepository>();
        setupJwTokenRepository();

        svc = new FindRefreshTokenApp(instance(jwTokenRepository));
    });

    function setupJwTokenRepository() {
        when(jwTokenRepository.findRefreshTokenByRaw(anything())).thenResolve(TokenFixture.RefreshToken.successJwToken);
    }

    test('should find the refresh token', async () => {
        const result = await svc.find(TokenFixture.RefreshToken.successRefreshToken);
        verify(jwTokenRepository.findAccessTokenByRaw(anything())).never();
        verify(jwTokenRepository.findRefreshTokenByRaw(anything())).once();
        expect(result).toEqual({ ...TokenFixture.RefreshToken.successJwToken });
    });

    reject('should reject with invalid refresh token', async () => {
        await svc.find(TokenFixture.RefreshToken.invalidRefreshToken);
    }, (err) => {
        expect(err).toBeInstanceOf(InvalidRefreshTokenError);
        verify(jwTokenRepository.findAccessTokenByRaw(anything())).never();
        verify(jwTokenRepository.findRefreshTokenByRaw(anything())).never();
    });
});