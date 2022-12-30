import { Inject } from "typedi";
import { Credential } from "../../../domain/credential/data/credential";
import { InvalidUserOrPasswordError } from "../../../domain/credential/data/invalid-login-or-password-error";
import { ICredentialRepository } from "../../../domain/credential/repository/credential-repository";
import { IoCId } from "../../../ioc/ioc-id";
import { ICredentialDatabase } from "../../database/credential-database";
import { ICryptoService } from "../service/crypto-service";

export class CredentialRepositoryImpl implements ICredentialRepository {
    constructor(
        @Inject(IoCId.Infra.DATABASE) private database: ICredentialDatabase,
        @Inject(IoCId.Infra.CRYPTO_SVC) private cryptoSvc: ICryptoService,
    ) { }

    async findCredentialByLoginAndPassword(
        login: string, password: string
    ): Promise<Credential> {
        const credential = await this.database.findCredentialByLogin(login);
        if (credential === null) {
            return Credential.empty;
        }

        if (!(await this.cryptoSvc.compare(password, credential.password))) {
            throw new InvalidUserOrPasswordError();
        }

        return credential.asDomain;
    }

}