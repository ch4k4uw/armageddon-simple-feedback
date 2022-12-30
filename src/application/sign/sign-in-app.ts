import { UserNotFoundError } from "../../domain/common/data/user-not-found-error";
import { LoggedUser } from "../../domain/common/entity/logged-user";
import { User } from "../../domain/common/entity/user";
import { IUserRepository } from "../../domain/common/repository/user-repository";
import { Credential } from "../../domain/credential/data/credential";
import { InvalidUserOrPasswordError } from "../../domain/credential/data/invalid-login-or-password-error";
import { ICredentialRepository } from "../../domain/credential/repository/credential-repository";
import { JwToken } from "../../domain/token/entity/jw-token";
import { RawJwToken } from "../../domain/token/data/raw-jw-token";
import { IJwTokenCmdRepository } from "../../domain/token/repository/jw-token-cmd-repository";
import { Inject, Service } from "typedi";
import { IoCId } from "../../ioc/ioc-id";

@Service()
export class SignInApp {
    constructor(
        @Inject(IoCId.Infra.CREDENTIAL_REPOSITORY) 
        private credentialRepository: ICredentialRepository,
        @Inject(IoCId.Infra.USER_REPOSITORY) 
        private userRepository: IUserRepository,
        @Inject(IoCId.Infra.JW_TOKEN_REPOSITORY) 
        private jwTokenRepository: IJwTokenCmdRepository,
    ) { }

    async signIn(login: string, password: string): Promise<RawJwToken> {
        const credential = await this.findCredential(login, password);
        this.assertCredentialNotEmpty(credential);
        const user = await this.findUser(credential.user);
        this.assertUserNotEmpty(user);

        const loggedUser = LoggedUser.create(user, credential.roles);
        const result = await this.createRawToken(loggedUser);

        return result;
    }

    private async findCredential(login: string, password: string): Promise<Credential> {
        return await this.credentialRepository.findCredentialByLoginAndPassword(login, password);
    }

    private assertCredentialNotEmpty(credential: Credential) {
        if (credential === Credential.empty) {
            throw new InvalidUserOrPasswordError();
        }
    }

    private async findUser(id: string): Promise<User> {
        return await this.userRepository.findById(id);
    }

    private assertUserNotEmpty(user: User) {
        if (user === User.empty) {
            throw new UserNotFoundError();
        }
    }

    private async createRawToken(loggedUser: LoggedUser): Promise<RawJwToken> {
        const jwToken = new JwToken(undefined, loggedUser, false, true);
        return await this.jwTokenRepository.insert(jwToken);
    }

}
