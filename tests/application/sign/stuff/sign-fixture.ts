import { LoggedUser } from "../../../../src/domain/common/entity/logged-user";
import { User } from "../../../../src/domain/common/entity/user"
import { Credential } from "../../../../src/domain/credential/data/credential"
import { Role } from "../../../../src/domain/credential/data/role"
import { JwToken } from "../../../../src/domain/token/data/jw-token";
import { RawJwToken } from "../../../../src/domain/token/data/raw-jw-token";
import { CommonFixture } from "../../common/stuff/common-fixture";



export namespace SignFixture {
    export class SignIn {
        private constructor() { }
        static get successCredential(): Credential {
            return CommonFixture.credential1;
        }

        static get successUser(): User {
            return CommonFixture.user1;
        }

        static get userNotFoundCredential(): Credential {
            return new Credential(
                this.userNotFound.id,
                this.userNotFound.email,
                [Role.admin],
            );
        }

        static get userNotFound(): User {
            return CommonFixture.user2;
        }

        static get invalidAccessTokenCredential(): Credential {
            return CommonFixture.credential3;
        }

        static get invalidAccessTokenUser(): User {
            return CommonFixture.user3;
        }

        static get invalidRefreshTokenCredential(): Credential {
            return new Credential(
                this.invalidRefreshTokenUser.id,
                this.invalidRefreshTokenUser.email,
                [Role.admin],
            );
        }

        static get invalidRefreshTokenUser(): User {
            return CommonFixture.user4;
        }

        static get successLoggedUser(): LoggedUser {
            return CommonFixture.loggedUser1;
        }

        private static get loggedUser3(): LoggedUser {
            return CommonFixture.loggedUser3;
        }

        static get successJwToken(): JwToken {
            return CommonFixture.jwToken1;
        }

        static get invalidAccessTokenJwToken(): JwToken {
            return new JwToken(this.loggedUser3, true, true);
        }

        static get successRawToken(): RawJwToken {
            return CommonFixture.rawJwToken1;
        }

        static get invalidAccessTokenRawToken(): RawJwToken {
            return this.successRawToken.cloneWith("", "b2");
        }

        static get invalidRefreshTokenRawToken(): RawJwToken {
            return this.successRawToken.cloneWith("a3", "");
        }
    }

    export class SignOut {
        private constructor() { }
        static get successJwToken(): JwToken {
            return SignIn.successJwToken;
        }

        static get invalidJwToken(): JwToken {
            return new JwToken(SignIn.successLoggedUser, false, false);
        }

        static get expiredJwToken(): JwToken {
            return new JwToken(SignIn.successLoggedUser, true, true);
        }
    }
}