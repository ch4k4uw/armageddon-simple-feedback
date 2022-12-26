import { CredentialModel } from "./model/credential-model";

export interface ICredentialDatabase {
    findCredentialByLogin(login: string): Promise<CredentialModel|null>;
}