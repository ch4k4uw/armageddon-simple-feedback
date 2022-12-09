import { anything, instance, mock, verify, when } from "ts-mockito";
import { FindAccessTokenApp } from "../../../src/application/token/find-access-token-app";
import { InvalidAccessTokenError } from "../../../src/domain/token/data/invalid-access-token-error";
import { IJwTokenRepository } from "../../../src/domain/token/repository/jw-token-repository";
import { reject } from "../../util/framework";
import { TokenFixture } from "./stuff/token-fixture";

describe('Find access token tests', () => {
    let svc: FindAccessTokenApp;
    let jwTokenRepository: IJwTokenRepository;

    beforeEach(() => {
        jwTokenRepository = mock<IJwTokenRepository>();
        setupJwTokenRepository();

        svc = new FindAccessTokenApp(instance(jwTokenRepository));
    });

    function setupJwTokenRepository() {
        when(jwTokenRepository.findAccessTokenByRaw(anything())).thenResolve(TokenFixture.AccessToken.successJwToken);
    }

    test('should find the access token', async () => {
        const result = await svc.find(TokenFixture.AccessToken.successAccessToken);
        verify(jwTokenRepository.findAccessTokenByRaw(anything())).once();
        verify(jwTokenRepository.findRefreshTokenByRaw(anything())).never();
        expect(result).toEqual({ ...TokenFixture.AccessToken.successJwToken });
    });

    reject('should reject with invalid access token', async () => {
        await svc.find(TokenFixture.AccessToken.invalidAccessToken);
    }, (err) => {
        expect(err).toBeInstanceOf(InvalidAccessTokenError);
        verify(jwTokenRepository.findAccessTokenByRaw(anything())).never();
        verify(jwTokenRepository.findRefreshTokenByRaw(anything())).never();
    });
});