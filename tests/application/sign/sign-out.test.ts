import { anyString, anything, instance, mock, verify, when } from "ts-mockito";
import { SignInApp } from "../../../src/application/sign/sign-in-app";
import { SignOutApp } from "../../../src/application/sign/sign-out-app";
import { UserNotFoundError } from "../../../src/domain/common/data/user-not-found-error";
import { User } from "../../../src/domain/common/entity/user";
import { IUserRepository } from "../../../src/domain/common/repository/user-repository";
import { Credential } from "../../../src/domain/credential/data/credential";
import { InvalidUserOrPasswordError } from "../../../src/domain/credential/data/invalid-login-or-password-error";
import { ICredentialRepository } from "../../../src/domain/credential/repository/credential-repository";
import { ExpiredRefreshTokenError } from "../../../src/domain/token/data/expired-refresh-token-error";
import { InvalidRefreshTokenError } from "../../../src/domain/token/data/invalid-refresh-token-error";
import { InvalidTokenError } from "../../../src/domain/token/data/invalid-token-error";
import { JwToken } from "../../../src/domain/token/data/jw-token";
import { IJwTokenCmdRepository } from "../../../src/domain/token/repository/jw-token-cmd-repository";
import { reject } from "../../util/framework";
import { SignFixture } from "./stuff/sign-fixture";

describe('Sign-out tests', () => {
    let svc: SignOutApp;
    let jwTokenRepository: IJwTokenCmdRepository;

    beforeEach(() => {
        jwTokenRepository = mock<IJwTokenCmdRepository>();
        setupJwTokenRepository();

        svc = new SignOutApp(instance(jwTokenRepository));
    });

    function setupJwTokenRepository() {
        when(jwTokenRepository.removeRefreshToken(anything())).thenResolve();
    }

    test('should perform sign-out', async () => {
        await svc.signOut(SignFixture.SignOut.successJwToken);
        verify(jwTokenRepository.removeRefreshToken(anything())).once();
    });

    reject('should reject with invalid invalid refresh token', async () => {
        await svc.signOut(SignFixture.SignOut.invalidJwToken);
    }, (err) => {
        expect(err).toBeInstanceOf(InvalidRefreshTokenError);
        verify(jwTokenRepository.removeRefreshToken(anything())).never();
    });

    reject('should reject with invalid expired refresh token', async () => {
        await svc.signOut(SignFixture.SignOut.expiredJwToken);
    }, (err) => {
        expect(err).toBeInstanceOf(ExpiredRefreshTokenError);
        verify(jwTokenRepository.removeRefreshToken(anything())).never();
    });
});