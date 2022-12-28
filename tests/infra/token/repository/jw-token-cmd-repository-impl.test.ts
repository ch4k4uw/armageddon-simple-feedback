import { group } from "console";
import { anyString, anything, capture, instance, verify } from "ts-mockito";
import { UserNotFoundError } from "../../../../src/domain/common/data/user-not-found-error";
import { InvalidRefreshTokenError } from "../../../../src/domain/token/data/invalid-refresh-token-error";
import { IJwTokenCmdRepository } from "../../../../src/domain/token/repository/jw-token-cmd-repository";
import { IDatabase } from "../../../../src/infra/database/database";
import { JwTokenCmdRepositoryImpl } from "../../../../src/infra/token/repository/jw-token-cmd-repository-impl";
import { IJwTokenService } from "../../../../src/infra/token/service/jw-token-service";
import { reject } from "../../../util/framework";
import { TokenRepositoryFixture } from "./stuff/token-repository-fixture";

describe('Jw token repository tests', () => {
    let database: IDatabase;
    let tokenSvc: IJwTokenService;
    let repo: IJwTokenCmdRepository;

    describe('insert', () => {
        beforeEach(() => {
            database = TokenRepositoryFixture.createDatabaseMock();
            tokenSvc = TokenRepositoryFixture.createJwTokenServiceMock();

            repo = new JwTokenCmdRepositoryImpl(instance(database), instance(tokenSvc));
        });

        test('should insert a new refresh token', async () => {
            const result = await repo.insert(TokenRepositoryFixture.Insert.Success.jwToken);
            expect(result).toEqual(TokenRepositoryFixture.Insert.Success.rawJwToken);
            verify(database.createId()).once();
            verify(database.findUserById(anyString())).once();
            verify(database.insertJwRefreshToken(anything())).once();

            const [jwTokenModel] = capture(database.insertJwRefreshToken).last();
            const currJwTokenModel = deleteDateFields(jwTokenModel);
            const expectedJwToenModel = deleteDateFields(TokenRepositoryFixture.Insert.Success.jwRefreshToken);

            expect(currJwTokenModel).toEqual(expectedJwToenModel);
        });

        function deleteDateFields(obj: any): any {
            obj = { ...obj };
            delete obj.created;
            delete obj.updated;
            return obj;
        }

        reject('should reject with user not found', async () => {
            await repo.insert(TokenRepositoryFixture.Insert.UserNotFound.jwToken);
        }, (err) => {
            expect(err).toBeInstanceOf(UserNotFoundError);
            verify(database.createId()).once();
            verify(database.findUserById(anyString())).once();
            verify(database.insertJwRefreshToken(anything())).never();
        });
    });

    describe('update access token', () => {
        beforeEach(() => {
            database = TokenRepositoryFixture.createDatabaseMock();
            tokenSvc = TokenRepositoryFixture.createJwTokenServiceMock();

            repo = new JwTokenCmdRepositoryImpl(instance(database), instance(tokenSvc));
        });

        test('should update the access token', async () => {
            const result = await repo.updateAccessToken(TokenRepositoryFixture.UpdateAccess.Success.jwToken);
            expect(result).toEqual(TokenRepositoryFixture.UpdateAccess.Success.rawJwToken);
            verify(database.createId()).once();
            verify(database.findJwRefreshTokenById(anyString()))
                .calledAfter(database.createId());
            verify(database.findUserById(anyString()))
                .calledAfter(database.findJwRefreshTokenById(anyString()));
            verify(database.insertAndUpdateRefreshToken(anything(), anything()))
                .calledAfter(database.findUserById(anyString()));

            const [newJwTokenModel, oldJwTokenModel] = capture(database.insertAndUpdateRefreshToken).last();

            expect(newJwTokenModel.id).not.toEqual(oldJwTokenModel.id);
            expect(newJwTokenModel.removed).toEqual(false);
            expect(oldJwTokenModel.removed).toEqual(true);
        });

        reject('should reject with invalid refresh token 1', async () => {
            await repo.updateAccessToken(TokenRepositoryFixture.UpdateAccess.InvalidRefreshToken1.jwToken);
        }, (err) => {
            expect(err).toBeInstanceOf(InvalidRefreshTokenError);
            verify(database.createId()).once();
            verify(database.findJwRefreshTokenById(anyString())).once();
            verify(database.findUserById(anyString())).never();
            verify(database.insertAndUpdateRefreshToken(anything(), anything())).never();
        });

        reject('should reject with invalid refresh token 2', async () => {
            await repo.updateAccessToken(TokenRepositoryFixture.UpdateAccess.InvalidRefreshToken2.jwToken);
        }, (err) => {
            expect(err).toBeInstanceOf(InvalidRefreshTokenError);
            verify(database.createId()).once();
            verify(database.findJwRefreshTokenById(anyString())).once();
            verify(database.findUserById(anyString())).never();
            verify(database.insertAndUpdateRefreshToken(anything(), anything())).never();
        });

        reject('should reject with user not found', async () => {
            await repo.updateAccessToken(TokenRepositoryFixture.UpdateAccess.UserNotFound.jwToken);
        }, (err) => {
            expect(err).toBeInstanceOf(UserNotFoundError);
            verify(database.createId()).once();
            verify(database.findJwRefreshTokenById(anyString())).once();
            verify(database.findUserById(anyString())).once();
            verify(database.insertAndUpdateRefreshToken(anything(), anything())).never();
        });
    });

    describe('remove refresh token', () => {
        beforeEach(() => {
            database = TokenRepositoryFixture.createDatabaseMock();
            tokenSvc = TokenRepositoryFixture.createJwTokenServiceMock();

            repo = new JwTokenCmdRepositoryImpl(instance(database), instance(tokenSvc));
        });

        test('should remove a refresh token', async () => {
            await repo.removeRefreshToken(TokenRepositoryFixture.RemoveRefresh.Success.jwToken);
            verify(database.findJwRefreshTokenById(anyString())).once();
            verify(database.updateJwRefreshToken(anything())).once();

            const [jwRefreshTokenModel] = capture(database.updateJwRefreshToken).last();

            expect(jwRefreshTokenModel.id)
                .toEqual(TokenRepositoryFixture.RemoveRefresh.Success.removedJwRefreshToken.id);
            expect(jwRefreshTokenModel.removed).toEqual(true);
        });

        reject('should reject with invalid refresh token 1', async () => {
            await repo.removeRefreshToken(TokenRepositoryFixture.RemoveRefresh.InvalidRefreshToken1.jwToken);
        }, (err) => {
            expect(err).toBeInstanceOf(InvalidRefreshTokenError);
            verify(database.findJwRefreshTokenById(anyString())).once();
            verify(database.updateJwRefreshToken(anything())).never();
        });

        reject('should reject with invalid refresh token 2', async () => {
            await repo.removeRefreshToken(TokenRepositoryFixture.RemoveRefresh.InvalidRefreshToken2.jwToken);
        }, (err) => {
            expect(err).toBeInstanceOf(InvalidRefreshTokenError);
            verify(database.findJwRefreshTokenById(anyString())).once();
            verify(database.updateJwRefreshToken(anything())).never();
        });
    });

    describe('find access token', () => {
        beforeEach(() => {
            database = TokenRepositoryFixture.createDatabaseMock();
            tokenSvc = TokenRepositoryFixture.createJwTokenServiceMock();

            repo = new JwTokenCmdRepositoryImpl(instance(database), instance(tokenSvc));
        });

        test('should find an access token', async () => {
            const result = await repo.findAccessTokenByRaw(TokenRepositoryFixture.FindAccessByRaw.Success.rawJwToken);
            expect(result).toEqual({ ...TokenRepositoryFixture.FindAccessByRaw.Success.jwToken });
            verify(tokenSvc.verifyAccessToken(anyString())).once();
        });
    });

    describe('find refresh token', () => {
        beforeEach(() => {
            database = TokenRepositoryFixture.createDatabaseMock();
            tokenSvc = TokenRepositoryFixture.createJwTokenServiceMock();

            repo = new JwTokenCmdRepositoryImpl(instance(database), instance(tokenSvc));
        });

        test('should find a refresh token', async () => {
            const result = await repo.findRefreshTokenByRaw(TokenRepositoryFixture.FindRefreshByRaw.Success.rawJwToken);
            expect(result).toEqual({ ...TokenRepositoryFixture.FindRefreshByRaw.Success.jwToken });
            verify(tokenSvc.verifyRefreshToken(anything())).calledBefore(database.findJwRefreshTokenById(anyString()));
            verify(database.findJwRefreshTokenById(anyString())).calledBefore(database.findUserById(anyString()));
            verify(database.findUserById(anyString())).calledAfter(database.findJwRefreshTokenById(anyString()));
        });

        reject('should reject with invalid refresh token error 1', async () => {
            await repo.findRefreshTokenByRaw(TokenRepositoryFixture.FindRefreshByRaw.InvalidRefreshToken1.rawJwToken);
        }, (err) => {
            expect(err).toBeInstanceOf(InvalidRefreshTokenError);
            verify(tokenSvc.verifyRefreshToken(anything())).once();
            verify(database.findJwRefreshTokenById(anyString())).once();
            verify(database.findUserById(anyString())).never();
        });

        reject('should reject with invalid refresh token error 2', async () => {
            await repo.findRefreshTokenByRaw(TokenRepositoryFixture.FindRefreshByRaw.InvalidRefreshToken2.rawJwToken);
        }, (err) => {
            expect(err).toBeInstanceOf(InvalidRefreshTokenError);
            verify(tokenSvc.verifyRefreshToken(anything())).once();
            verify(database.findJwRefreshTokenById(anyString())).once();
            verify(database.findUserById(anyString())).never();
        });

        reject('should reject with user not found error', async () => {
            await repo.findRefreshTokenByRaw(TokenRepositoryFixture.FindRefreshByRaw.UserNotFound.rawJwToken);
        }, (err) => {
            expect(err).toBeInstanceOf(UserNotFoundError);
            verify(tokenSvc.verifyRefreshToken(anything())).once();
            verify(database.findJwRefreshTokenById(anyString())).once();
            verify(database.findUserById(anyString())).once();
        });
    });
});