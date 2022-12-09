import { Credential } from "../data/credential";

export interface ICredentialRepository {
    findCredentialByLoginAndPassword(login: string, password: string): Promise<Credential>;
}