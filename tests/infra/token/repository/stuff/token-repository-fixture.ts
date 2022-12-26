import { anything, mock, when } from "ts-mockito";
import { LoggedUser } from "../../../../../src/domain/common/entity/logged-user";
import { User } from "../../../../../src/domain/common/entity/user";
import { Role } from "../../../../../src/domain/credential/data/role";
import { RawJwToken } from "../../../../../src/domain/token/data/raw-jw-token";
import { JwToken } from "../../../../../src/domain/token/entity/jw-token";
import { IDatabase } from "../../../../../src/infra/database/database";
import { JwRefreshTokenModel } from "../../../../../src/infra/database/model/jw-refresh-token-model";
import { UserModel } from "../../../../../src/infra/database/model/user-model";
import { IJwTokenService } from "../../../../../src/infra/token/service/jw-token-service";
import { JwAccessTokenPayloadModel } from "../../../../../src/infra/token/service/model/jw-access-token-payload-model";
import { JwRefreshTokenPayloadModel } from "../../../../../src/infra/token/service/model/jw-refresh-token-payload-model";

export namespace TokenRepositoryFixture {
    let currId = 0;

    export function createDatabaseMock() {
        let database = mock<IDatabase>();

        when(database.createId()).thenCall(async () => nextId());
        when(database.dateTime).thenCall(() => {
            return Date.now();
        });

        when(database.findUserById(Insert.Success.user.id))
            .thenResolve(Insert.Success.userModel);
        when(database.findUserById(Insert.UserNotFound.user.id))
            .thenCall(async () => null);
        when(database.findUserById(UpdateAccess.Success.user.id))
            .thenResolve(UpdateAccess.Success.userModel);
        when(database.findUserById(UpdateAccess.UserNotFound.user.id))
            .thenCall(async () => null);
        when(database.findUserById(UpdateAccess.InvalidRefreshToken1.user.id))
            .thenResolve(UpdateAccess.InvalidRefreshToken1.userModel);
        when(database.findUserById(UpdateAccess.InvalidRefreshToken2.user.id))
            .thenResolve(UpdateAccess.InvalidRefreshToken2.userModel);
        when(database.findUserById(FindRefreshByRaw.Success.user.id))
            .thenResolve(FindRefreshByRaw.Success.userModel);
        when(database.findUserById(FindRefreshByRaw.UserNotFound.user.id))
            .thenCall(async () => null);

        when(database.insertJwRefreshToken(anything())).thenResolve();

        when(database.findJwRefreshTokenById(UpdateAccess.Success.jwToken.id))
            .thenResolve(UpdateAccess.Success.jwRefreshToken);
        when(database.findJwRefreshTokenById(UpdateAccess.InvalidRefreshToken1.jwToken.id))
            .thenResolve(UpdateAccess.InvalidRefreshToken1.jwRefreshToken);
        when(database.findJwRefreshTokenById(UpdateAccess.InvalidRefreshToken2.jwToken.id))
            .thenCall(async () => null);
        when(database.findJwRefreshTokenById(UpdateAccess.UserNotFound.jwToken.id))
            .thenResolve(UpdateAccess.UserNotFound.jwRefreshToken);
        when(database.findJwRefreshTokenById(RemoveRefresh.Success.jwToken.id))
            .thenResolve(RemoveRefresh.Success.jwRefreshToken);
        when(database.findJwRefreshTokenById(RemoveRefresh.InvalidRefreshToken1.jwToken.id))
            .thenResolve(RemoveRefresh.InvalidRefreshToken1.jwRefreshToken);
        when(database.findJwRefreshTokenById(RemoveRefresh.InvalidRefreshToken2.jwToken.id))
            .thenCall(async () => null);
        when(database.findJwRefreshTokenById(FindRefreshByRaw.Success.jwToken.id))
            .thenResolve(FindRefreshByRaw.Success.jwRefreshToken);
        when(database.findJwRefreshTokenById(FindRefreshByRaw.InvalidRefreshToken1.jwToken.id))
            .thenResolve(FindRefreshByRaw.InvalidRefreshToken1.jwRefreshToken);
        when(database.findJwRefreshTokenById(FindRefreshByRaw.InvalidRefreshToken2.jwToken.id))
            .thenCall(async () => null);
        when(database.findJwRefreshTokenById(FindRefreshByRaw.UserNotFound.jwToken.id))
            .thenResolve(FindRefreshByRaw.UserNotFound.jwRefreshToken);

        when(database.insertAndUpdateRefreshToken(anything(), anything())).thenResolve();

        when(database.updateJwRefreshToken(anything())).thenResolve();

        return database;
    }

    function nextId() {
        return `${++currId}`;
    }

    export namespace Insert {
        export class Success {
            private constructor() { }
            static date = Date.now();

            static get jwToken() {
                return new JwToken(
                    this.loggedUser.id,
                    this.loggedUser,
                    false,
                    true,
                );
            }

            static get loggedUser() {
                return LoggedUser.create(this.user, [Role.admin]);
            }

            static get user() {
                return new User("a1", "b1", "c1", "d1");
            }

            static get jwRefreshToken() {
                return new JwRefreshTokenModel(
                    `${currId}`, this.userModel, false, this.date, this.date
                );
            }

            static get userModel() {
                return new UserModel(
                    this.user.id,
                    this.user.firstName,
                    this.user.lastName,
                    this.user.email,
                    this.date,
                    this.date,
                );
            }

            static get rawJwToken() {
                return new RawJwToken("a1", "b1");
            }
        }

        export class UserNotFound {
            private constructor() { }
            static get jwToken() {
                return new JwToken(
                    this.loggedUser.id,
                    this.loggedUser,
                    false,
                    true,
                );
            }

            static get loggedUser() {
                return LoggedUser.create(this.user, [Role.admin]);
            }

            static get user() {
                return new User("a2", "b2", "c2", "d2");
            }
        }
    }

    export function createJwTokenServiceMock() {
        let svc = mock<IJwTokenService>();

        when(svc.createAccessToken(anything())).thenResolve(Insert.Success.rawJwToken.accessToken);
        when(svc.createRefreshToken(anything())).thenResolve(Insert.Success.rawJwToken.refreshToken);
        when(svc.verifyAccessToken(anything())).thenResolve(FindAccessByRaw.Success.jwAccessTokenPayloadModel);
        when(svc.verifyRefreshToken(anything())).thenCall(async (...args: any[]) => {
            const raw = args[0] as string;
            switch (raw) {
                case FindRefreshByRaw.Success.rawJwToken.refreshToken:
                    return FindRefreshByRaw.Success.jwRefreshTokenPayloadModel;
                case FindRefreshByRaw.InvalidRefreshToken1.rawJwToken.refreshToken:
                    return FindRefreshByRaw.InvalidRefreshToken1.jwRefreshTokenPayloadModel;
                case FindRefreshByRaw.InvalidRefreshToken2.rawJwToken.refreshToken:
                    return FindRefreshByRaw.InvalidRefreshToken2.jwRefreshTokenPayloadModel;
                case FindRefreshByRaw.UserNotFound.rawJwToken.refreshToken:
                    return FindRefreshByRaw.UserNotFound.jwRefreshTokenPayloadModel;
                default:
                    throw new Error("unexpected refresh token");
            }
        });

        return svc;
    }

    export namespace UpdateAccess {
        export class Success {
            private constructor() { }
            static get jwToken() {
                return Insert.Success.jwToken;
            }
            static get userModel() {
                return Insert.Success.userModel;
            }

            static get jwRefreshToken() {
                return Insert.Success.jwRefreshToken;
            }

            static get user() {
                return Insert.Success.user;
            }

            static get rawJwToken() {
                return Insert.Success.rawJwToken;
            }
        }

        export class InvalidRefreshToken1 {
            private constructor() { }
            static date = Date.now();
            static get jwToken() {
                return new JwToken(
                    this.loggedUser.id,
                    this.loggedUser,
                    false,
                    true,
                );
            }

            static get loggedUser() {
                return LoggedUser.create(this.user, [Role.admin]);
            }

            static get user() {
                return new User("a3", "b3", "c3", "d3");
            }

            static get jwRefreshToken() {
                return new JwRefreshTokenModel(
                    this.jwToken.id, this.userModel, true, this.date, this.date
                );
            }

            static get userModel() {
                return new UserModel(
                    this.user.id,
                    this.user.firstName,
                    this.user.lastName,
                    this.user.email,
                    this.date,
                    this.date,
                );
            }
        }

        export class InvalidRefreshToken2 {
            private constructor() { }
            static get jwToken() {
                return new JwToken(
                    this.loggedUser.id,
                    this.loggedUser,
                    false,
                    true,
                );
            }

            static get loggedUser() {
                return LoggedUser.create(this.user, [Role.admin]);
            }

            static get user() {
                return new User("a5", "b5", "c5", "d5");
            }

            static get userModel() {
                return new UserModel(
                    this.user.id,
                    this.user.firstName,
                    this.user.lastName,
                    this.user.email,
                    InvalidRefreshToken1.userModel.created,
                    InvalidRefreshToken1.userModel.updated,
                );
            }
        }

        export class UserNotFound {
            private constructor() { }
            static date = Date.now();
            static get jwToken() {
                return new JwToken(
                    this.loggedUser.id,
                    this.loggedUser,
                    false,
                    true,
                );
            }

            static get loggedUser() {
                return LoggedUser.create(this.user, [Role.admin]);
            }

            static get user() {
                return new User("a4", "b4", "c4", "d4");
            }

            static get jwRefreshToken() {
                return new JwRefreshTokenModel(
                    this.user.id, this.userModel, false, this.date, this.date
                );
            }

            static get userModel() {
                return new UserModel(
                    this.user.id,
                    this.user.firstName,
                    this.user.lastName,
                    this.user.email,
                    this.date,
                    this.date,
                );
            }
        }
    }

    export namespace RemoveRefresh {
        export class Success {
            private constructor() { }
            static date = Date.now();
            static get jwToken() {
                return new JwToken(
                    this.loggedUser.id,
                    this.loggedUser,
                    false,
                    true,
                );
            }

            static get loggedUser() {
                return LoggedUser.create(this.user, [Role.admin]);
            }

            static get user() {
                return new User("a6", "b6", "c6", "d6");
            }

            static get jwRefreshToken() {
                return new JwRefreshTokenModel(
                    this.user.id, this.userModel, false, this.date, this.date
                );
            }

            static get removedJwRefreshToken() {
                return this.jwRefreshToken.toRemoved(this.date);
            }

            static get userModel() {
                return new UserModel(
                    this.user.id,
                    this.user.firstName,
                    this.user.lastName,
                    this.user.email,
                    this.date,
                    this.date,
                );
            }
        }

        export class InvalidRefreshToken1 {
            private constructor() { }
            static date = Date.now();
            static get jwToken() {
                return new JwToken(
                    this.loggedUser.id,
                    this.loggedUser,
                    false,
                    true,
                );
            }

            static get loggedUser() {
                return LoggedUser.create(this.user, [Role.admin]);
            }

            static get user() {
                return new User("a7", "b7", "c7", "d7");
            }

            static get jwRefreshToken() {
                return new JwRefreshTokenModel(
                    this.user.id, this.userModel, true, this.date, this.date
                );
            }

            static get userModel() {
                return new UserModel(
                    this.user.id,
                    this.user.firstName,
                    this.user.lastName,
                    this.user.email,
                    this.date,
                    this.date,
                );
            }
        }

        export class InvalidRefreshToken2 {
            private constructor() { }
            static get jwToken() {
                return new JwToken(
                    this.loggedUser.id,
                    this.loggedUser,
                    false,
                    true,
                );
            }

            static get loggedUser() {
                return LoggedUser.create(this.user, [Role.admin]);
            }

            static get user() {
                return new User("a8", "b8", "c8", "d8");
            }
        }
    }

    export namespace FindAccessByRaw {
        export class Success {
            private constructor() { }
            static get rawJwToken() {
                return Insert.Success.rawJwToken;
            }

            static get jwAccessTokenPayloadModel() {
                return new JwAccessTokenPayloadModel(
                    Insert.Success.loggedUser
                );
            }

            static get jwToken() {
                return new JwToken(
                    this.jwAccessTokenPayloadModel.loggedUser.id,
                    this.jwAccessTokenPayloadModel.loggedUser,
                    false,
                    true,
                );
            }
        }
    }

    export namespace FindRefreshByRaw {
        export class Success {
            private constructor() { }
            static date = Date.now();
            static get rawJwToken() {
                return Insert.Success.rawJwToken;
            }

            static get jwRefreshTokenPayloadModel() {
                return new JwRefreshTokenPayloadModel(
                    "e9",
                    this.loggedUser
                );
            }

            static get loggedUser() {
                return LoggedUser.create(this.user, [Role.admin]);
            }

            static get user() {
                return new User("a9", "b9", "c9", "d9");
            }

            static get jwToken() {
                return new JwToken(
                    this.jwRefreshTokenPayloadModel.id,
                    this.jwRefreshTokenPayloadModel.loggedUser,
                    false,
                    true,
                );
            }

            static get jwRefreshToken() {
                return new JwRefreshTokenModel(
                    this.jwToken.id, this.userModel, false, this.date, this.date
                );
            }

            static get userModel() {
                return new UserModel(
                    this.user.id,
                    this.user.firstName,
                    this.user.lastName,
                    this.user.email,
                    this.date,
                    this.date,
                );
            }
        }

        export class InvalidRefreshToken1 {
            private constructor() { }
            static date = Date.now();
            static get rawJwToken() {
                return new RawJwToken("a2", "b2");
            }

            static get jwRefreshTokenPayloadModel() {
                return new JwRefreshTokenPayloadModel(
                    "e10",
                    this.loggedUser
                );
            }

            static get loggedUser() {
                return LoggedUser.create(this.user, [Role.admin]);
            }

            static get jwToken() {
                return new JwToken(
                    this.jwRefreshTokenPayloadModel.id,
                    this.jwRefreshTokenPayloadModel.loggedUser,
                    false,
                    true,
                );
            }

            static get user() {
                return new User("a10", "b10", "c10", "d10");
            }

            static get jwRefreshToken() {
                return new JwRefreshTokenModel(
                    this.jwToken.id, this.userModel, true, this.date, this.date
                );
            }

            static get userModel() {
                return new UserModel(
                    this.user.id,
                    this.user.firstName,
                    this.user.lastName,
                    this.user.email,
                    this.date,
                    this.date,
                );
            }
        }

        export class InvalidRefreshToken2 {
            private constructor() { }
            static get rawJwToken() {
                return new RawJwToken("a3", "b3");
            }

            static get jwRefreshTokenPayloadModel() {
                return new JwRefreshTokenPayloadModel(
                    "e11",
                    this.loggedUser
                );
            }

            static get loggedUser() {
                return LoggedUser.create(this.user, [Role.admin]);
            }

            static get user() {
                return new User("a11", "b11", "c11", "d11");
            }

            static get jwToken() {
                return new JwToken(
                    this.jwRefreshTokenPayloadModel.id,
                    this.jwRefreshTokenPayloadModel.loggedUser,
                    false,
                    true,
                );
            }
        }

        export class UserNotFound {
            private constructor() { }
            static date = Date.now();
            static get rawJwToken() {
                return new RawJwToken("a4", "b4");
            }

            static get jwRefreshTokenPayloadModel() {
                return new JwRefreshTokenPayloadModel(
                    "e12",
                    this.loggedUser
                );
            }

            static get loggedUser() {
                return LoggedUser.create(this.user, [Role.admin]);
            }

            static get jwToken() {
                return new JwToken(
                    this.jwRefreshTokenPayloadModel.id,
                    this.jwRefreshTokenPayloadModel.loggedUser,
                    false,
                    true,
                );
            }

            static get user() {
                return new User("a12", "b12", "c12", "d12");
            }

            static get jwRefreshToken() {
                return new JwRefreshTokenModel(
                    this.jwToken.id, this.userModel, false, this.date, this.date
                );
            }

            static get userModel() {
                return new UserModel(
                    this.user.id,
                    this.user.firstName,
                    this.user.lastName,
                    this.user.email,
                    this.date,
                    this.date,
                );
            }
        }
    }
}