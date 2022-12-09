import { UserNotFoundError } from "../../domain/common/data/user-not-found-error";
import { LoggedUser } from "../../domain/common/entity/logged-user";
import { User } from "../../domain/common/entity/user";
import { IUserRepository } from "../../domain/common/repository/user-repository";
import { Credential } from "../../domain/credential/data/credential";
import { InvalidUserOrPasswordError } from "../../domain/credential/data/invalid-login-or-password-error";
import { ICredentialRepository } from "../../domain/credential/repository/credential-repository";
import { JwToken } from "../../domain/token/data/jw-token";
import { RawJwToken } from "../../domain/token/data/raw-jw-token";
import { IJwTokenCmdRepository } from "../../domain/token/repository/jw-token-cmd-repository";

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