import { UserPrivilegeError } from "../../../domain/common/data/user-privilege-error";
import { Role } from "../../../domain/credential/data/role";
import { ExpiredAccessTokenError } from "../../../domain/token/data/expired-access-token-error";
import { InvalidAccessTokenError } from "../../../domain/token/data/invalid-access-token-error";
import { JwToken } from "../../../domain/token/entity/jw-token";

export class AccessTokenAssertionApp {
    constructor(private allowedRoles: Role[]) { }

    protected assertToken(token: JwToken) {
        if (!token.isValid) {
            throw new InvalidAccessTokenError();
        }
        if (token.isExpired) {
            throw new ExpiredAccessTokenError();
        }
        if (token.loggedUser.roles.findIndex((v) => this.allowedRoles.includes(v)) === -1) {
            throw new UserPrivilegeError();
        }
    }
}