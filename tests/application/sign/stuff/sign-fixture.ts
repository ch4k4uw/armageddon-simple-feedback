import { LoggedUser } from "../../../../src/domain/common/entity/logged-user";
import { User } from "../../../../src/domain/common/entity/user"
import { Credential } from "../../../../src/domain/credential/data/credential"
import { Role } from "../../../../src/domain/credential/data/role"
import { JwToken } from "../../../../src/domain/token/data/jw-token";
import { RawJwToken } from "../../../../src/domain/token/data/raw-jw-token";

export class SignFixture {
    static get successCredential(): Credential {
        return new Credential(
            SignFixture.successUser.id,
            SignFixture.successUser.email,
            [Role.admin],
        );
    }
    
    static get userNotFoundCredential(): Credential {
        return new Credential(
            SignFixture.userNotFound.id,
            SignFixture.userNotFound.email,
            [Role.admin],
        );
    }
    
    static get invalidAccessTokenCredential(): Credential {
        return new Credential(
            SignFixture.invalidAccessTokenUser.id,
            SignFixture.invalidAccessTokenUser.email,
            [Role.admin],
        );
    }
    
    static get invalidRefreshTokenCredential(): Credential {
        return new Credential(
            SignFixture.invalidRefreshTokenUser.id,
            SignFixture.invalidRefreshTokenUser.email,
            [Role.admin],
        );
    }

    static get successUser(): User {
        return new User("a1", "b1", "c1", "d1");
    }
    
    static get userNotFound(): User {
        return new User("a2", "b2", "c2", "d2");
    }
    
    static get invalidAccessTokenUser(): User {
        return new User("a3", "b3", "c3", "d3");
    }
    
    static get invalidRefreshTokenUser(): User {
        return new User("a4", "b4", "c4", "d4");
    }

    private static get loggedUser1(): LoggedUser {
        return new LoggedUser(this.successUser.id, this.successUser.firstName + ' ' + this.successUser.lastName, this.successCredential.roles);
    }
    
    private static get loggedUser3(): LoggedUser {
        return new LoggedUser(this.invalidAccessTokenUser.id, this.invalidAccessTokenUser.firstName + ' ' + this.invalidAccessTokenUser.lastName, this.invalidAccessTokenCredential.roles);
    }
    
    private static get loggedUser4(): LoggedUser {
        return new LoggedUser(this.invalidRefreshTokenUser.id, this.invalidRefreshTokenUser.firstName + ' ' + this.invalidRefreshTokenUser.lastName, this.invalidRefreshTokenCredential.roles);
    }

    static get successJwToken(): JwToken {
        return new JwToken(this.loggedUser1, false, true);
    }
    
    static get invalidAccessTokenJwToken(): JwToken {
        return new JwToken(this.loggedUser3, true, true);
    }
    
    static get jwToken4(): JwToken {
        return new JwToken(this.loggedUser4, true, true);
    }

    static get successRawToken(): RawJwToken {
        return new RawJwToken("a1", "b1");
    }
    
    static get invalidAccessTokenRawToken(): RawJwToken {
        return new RawJwToken("", "b2");
    }
    
    static get invalidRefreshTokenRawToken(): RawJwToken {
        return new RawJwToken("a3", "");
    }

}