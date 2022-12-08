import { UserNotFoundError } from "../../domain/common/data/user-not-found-error";
import { User } from "../../domain/common/entity/user";
import { IUserRepository } from "../../domain/common/repository/user-repository";
import { InvalidUserOrPasswordError } from "../../domain/credential/data/invalid-login-or-password-error";
import { Credential } from "../../domain/credential/data/credential";
import { ICredentialRepository } from "../../domain/credential/repository/credential-repository";
import { IJwTokenCmdRepository } from "../../domain/token/repository/jw-token-cmd-repository";
import { LoggedUser } from "../../domain/common/entity/logged-user";
import { RawJwToken } from "../../domain/token/data/raw-jw-token";
import { InvalidTokenError } from "../../domain/token/data/invalid-token-error";
import { JwToken } from "../../domain/token/data/jw-token";

export class SignInApp {
    constructor(
        private credentialRepository: ICredentialRepository,
        private userRepository: IUserRepository,
        private jwTokenRepository: IJwTokenCmdRepository,
    ) { }

    async signIn(login: string, password: string): Promise<RawJwToken> {
        const credential = await this.findCredential(login, password);
        credential.assertNotEmpty();
        const user = await this.findUser(credential.user);
        user.assertNotEmpty();

        const loggedUser = new LoggedUser(user.id, user.name, credential.roles);
        const result = await this.createRawToken(loggedUser);

        result.assertValidToken();

        return result;
    }

    private async findCredential(login: string, password: string): Promise<Credential> {
        return await this.credentialRepository.findCredentialByLoginAndPassword(login, password);
    }

    private async findUser(id: string): Promise<User> {
        return await this.userRepository.findById(id);
    }

    private async createRawToken(loggedUser: LoggedUser): Promise<RawJwToken> {
        const jwToken = new JwToken(loggedUser, false, true);
        return await this.jwTokenRepository.insert(jwToken);
    }

}

declare module "../../domain/common/entity/user" {
    interface User {
        assertNotEmpty(): void;
        name: string;
    }
}

User.prototype.assertNotEmpty = function () {
    if (this === User.empty) {
        throw new UserNotFoundError();
    }
}

Object.defineProperty(User.prototype, "name", {
    get(this: User) {
        return this.firstName + ' ' + this.lastName;
    },
    enumerable: false,
    configurable: true,
});

declare module "../../domain/credential/data/credential" {
    interface Credential {
        assertNotEmpty(): void;
    }
}

Credential.prototype.assertNotEmpty = function () {
    if (this === Credential.empty) {
        throw new InvalidUserOrPasswordError();
    }
}

declare module "../../domain/token/data/raw-jw-token" {
    interface RawJwToken {
        assertValidToken(): void;
    }
}

RawJwToken.prototype.assertValidToken = function () {
    if (!this.isAccessToken || !this.isRefreshToken) {
        throw new InvalidTokenError();
    }
};