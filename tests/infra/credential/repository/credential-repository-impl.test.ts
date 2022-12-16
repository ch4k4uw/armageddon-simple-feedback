import { anyString, anything, instance, mock, verify, when } from "ts-mockito";
import { Credential } from "../../../../src/domain/credential/data/credential";
import { InvalidUserOrPasswordError } from "../../../../src/domain/credential/data/invalid-login-or-password-error";
import { Role } from "../../../../src/domain/credential/data/role";
import { ICredentialRepository } from "../../../../src/domain/credential/repository/credential-repository";
import { CredentialRepositoryImpl } from "../../../../src/infra/credential/repository/credential-repository-impl";
import { ICryptoService } from "../../../../src/infra/credential/service/crypto-service";
import { ICredentialDatabase } from "../../../../src/infra/database/credential-database";
import { CredentialModel } from "../../../../src/infra/database/model/credential-model";
import { reject } from "../../../util/framework";

const fixture = {
    success: {
        login: "success",
        password: "success",
        results: {
            credential: new CredentialModel("a1", "b1", "d1", [Role[Role.admin]]),
            expected: function() {
                return this.credential.asDomain;
            }
        },
    },
    credentialNotFound: {
        login: "not-found",
        password: "not-found",
    },
    invalidUserOrPassword: {
        login: "invalid-user-or-password",
        password: "invalid-user-or-password",
        results: {
            credential: new CredentialModel("a2", "b2", "d2", [Role[Role.admin]])
        },
    }
};

describe('Credential repository tests', () => {
    let repo: ICredentialRepository;
    let database: ICredentialDatabase;
    let cryptoSvc: ICryptoService;

    beforeEach(() => {
        database = mock<ICredentialDatabase>();
        cryptoSvc = mock<ICryptoService>();

        when(database.findCredentialByLogin(fixture.success.login))
            .thenResolve(fixture.success.results.credential);
        when(database.findCredentialByLogin(fixture.credentialNotFound.login))
            .thenCall(async () => null);
        when(database.findCredentialByLogin(fixture.invalidUserOrPassword.login))
            .thenResolve(fixture.invalidUserOrPassword.results.credential);

        when(
            cryptoSvc.compare(
                fixture.success.password,
                fixture.success.results.credential.password
            )
        ).thenResolve(true);
        when(
            cryptoSvc.compare(
                fixture.invalidUserOrPassword.password,
                fixture.invalidUserOrPassword.results.credential.password
            )
        ).thenResolve(false);

        repo = new CredentialRepositoryImpl(instance(database), instance(cryptoSvc));

    });

    test('should find a credential', async () => {
        const result = await repo.findCredentialByLoginAndPassword(
            fixture.success.login,
            fixture.success.password,
        );

        expect(result).toEqual({ ...fixture.success.results.expected() });
        verify(database.findCredentialByLogin(anyString()))
            .calledBefore(cryptoSvc.compare(anyString(), anyString()));
        verify(cryptoSvc.compare(anyString(), anyString()))
            .calledAfter(database.findCredentialByLogin(anyString()));
    });

    test('shouldn\'t find a credential', async () => {
        const result = await repo.findCredentialByLoginAndPassword(
            fixture.credentialNotFound.login,
            fixture.credentialNotFound.password,
        );
        expect(result).toEqual({ ...Credential.empty });
        verify(database.findCredentialByLogin(anyString()))
            .once();
        verify(cryptoSvc.compare(anyString(), anyString()))
            .never();
    });

    reject('should reject with invalid user or password error', async () => {
        await repo.findCredentialByLoginAndPassword(
            fixture.invalidUserOrPassword.login,
            fixture.invalidUserOrPassword.password,
        );
    }, (err) => {
        expect(err).toBeInstanceOf(InvalidUserOrPasswordError);
        verify(database.findCredentialByLogin(anyString()))
            .calledBefore(cryptoSvc.compare(anyString(), anyString()));
        verify(cryptoSvc.compare(anyString(), anyString()))
            .calledAfter(database.findCredentialByLogin(anyString()));
    });
});