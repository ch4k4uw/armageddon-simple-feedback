import { LoggedUser } from "../../../../src/domain/common/entity/logged-user";
import { User } from "../../../../src/domain/common/entity/user";
import { Credential } from "../../../../src/domain/credential/data/credential";
import { Role } from "../../../../src/domain/credential/data/role";
import { JwToken } from "../../../../src/domain/token/data/jw-token";
import { RawJwToken } from "../../../../src/domain/token/data/raw-jw-token";

export class CommonFixture {
    static get loggedUser1(): LoggedUser {
        return new LoggedUser(this.user1.id, this.user1.firstName + ' ' + this.user1.lastName, this.credential1.roles);
    }

    static get user1(): User {
        return new User("a1", "b1", "c1", "d1");
    }

    static get credential1(): Credential {
        return new Credential(
            this.user1.id,
            this.user1.email,
            [Role.admin],
        );
    }

    static get user2(): User {
        return new User("a2", "b2", "c2", "d2");
    }

    static get loggedUser3(): LoggedUser {
        return new LoggedUser(this.user3.id, this.user3.firstName + ' ' + this.user3.lastName, this.credential3.roles);
    }

    static get user3(): User {
        return new User("a3", "b3", "c3", "d3");
    }

    static get credential3(): Credential {
        return new Credential(
            this.user3.id,
            this.user3.email,
            [Role.admin],
        );
    }

    static get user4(): User {
        return new User("a4", "b4", "c4", "d4");
    }

    static get rawJwToken1(): RawJwToken {
        return new RawJwToken("a1", "b1");
    }

    static get jwToken1(): JwToken {
        return new JwToken(this.loggedUser1, false, true);
    }
}