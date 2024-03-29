import { anyString, anything, instance, mock, verify, when } from "ts-mockito";
import { SignInApp } from "../../../src/application/sign/sign-in-app";
import { UserNotFoundError } from "../../../src/domain/common/data/user-not-found-error";
import { User } from "../../../src/domain/common/entity/user";
import { IUserRepository } from "../../../src/domain/common/repository/user-repository";
import { Credential } from "../../../src/domain/credential/data/credential";
import { InvalidUserOrPasswordError } from "../../../src/domain/credential/data/invalid-login-or-password-error";
import { ICredentialRepository } from "../../../src/domain/credential/repository/credential-repository";
import { IJwTokenCmdRepository } from "../../../src/domain/token/repository/jw-token-cmd-repository";
import { reject } from "../../util/framework";
import { SignFixture } from "./stuff/sign-fixture";

const entryPoints = {
    success: "success",
    invalidUserOrPass: "invalid-user-or-pass",
    userNotFount: "user-not-found",
    invalidAccessToken: "invalid-access-token",
    invalidRefreshToken: "invalid-refresh-token",
};

describe('Sign-in tests', () => {
    let svc: SignInApp;
    let credentialRepository: ICredentialRepository;
    let userRepository: IUserRepository;
    let jwTokenRepository: IJwTokenCmdRepository;

    beforeEach(() => {
        credentialRepository = mock<ICredentialRepository>();
        userRepository = mock<IUserRepository>();
        jwTokenRepository = mock<IJwTokenCmdRepository>();

        setupCredentialRepository();
        setupUserRepository();
        setupJwTokenRepository();

        svc = new SignInApp(instance(credentialRepository), instance(userRepository), instance(jwTokenRepository));
    });

    function setupCredentialRepository() {
        when(credentialRepository.findCredentialByLoginAndPassword(entryPoints.success, entryPoints.success))
            .thenResolve(SignFixture.SignIn.successCredential);
        when(credentialRepository.findCredentialByLoginAndPassword(entryPoints.invalidUserOrPass, entryPoints.invalidUserOrPass))
            .thenResolve(Credential.empty);
        when(credentialRepository.findCredentialByLoginAndPassword(entryPoints.userNotFount, entryPoints.userNotFount))
            .thenResolve(SignFixture.SignIn.userNotFoundCredential);
        when(credentialRepository.findCredentialByLoginAndPassword(entryPoints.invalidAccessToken, entryPoints.invalidAccessToken))
            .thenResolve(SignFixture.SignIn.invalidAccessTokenCredential);
        when(credentialRepository.findCredentialByLoginAndPassword(entryPoints.invalidRefreshToken, entryPoints.invalidRefreshToken))
            .thenResolve(SignFixture.SignIn.invalidRefreshTokenCredential);
    }

    function setupUserRepository() {
        when(userRepository.findById(SignFixture.SignIn.successUser.id)).thenResolve(SignFixture.SignIn.successUser);
        when(userRepository.findById(SignFixture.SignIn.userNotFound.id)).thenResolve(User.empty);
        when(userRepository.findById(SignFixture.SignIn.invalidAccessTokenUser.id)).thenResolve(SignFixture.SignIn.invalidAccessTokenUser);
        when(userRepository.findById(SignFixture.SignIn.invalidRefreshTokenUser.id)).thenResolve(SignFixture.SignIn.invalidRefreshTokenUser);
    }

    function setupJwTokenRepository() {
        when(jwTokenRepository.insert(anything())).thenResolve(SignFixture.SignIn.successRawToken);
    }

    test('should perform sign-in', async () => {
        const result = await svc.signIn(entryPoints.success, entryPoints.success);
        expect(result).toEqual({ ...SignFixture.SignIn.successRawToken });
        verify(credentialRepository.findCredentialByLoginAndPassword(anyString(), anyString())).once();
        verify(userRepository.findById(anyString())).once();
        verify(jwTokenRepository.insert(anything())).once();
    });

    reject('should reject with invalid user or pass', async () => {
        await svc.signIn(entryPoints.invalidUserOrPass, entryPoints.invalidUserOrPass);
    }, (err) => {
        expect(err).toBeInstanceOf(InvalidUserOrPasswordError);
        verify(credentialRepository.findCredentialByLoginAndPassword(anyString(), anyString())).once();
        verify(userRepository.findById(anyString())).never();
        verify(jwTokenRepository.insert(anything())).never();
    });

    reject('should reject with user not found', async () => {
        await svc.signIn(entryPoints.userNotFount, entryPoints.userNotFount);
    }, (err) => {
        expect(err).toBeInstanceOf(UserNotFoundError);
        verify(credentialRepository.findCredentialByLoginAndPassword(anyString(), anyString())).once();
        verify(userRepository.findById(anyString())).once();
        verify(jwTokenRepository.insert(anything())).never();
    });
});