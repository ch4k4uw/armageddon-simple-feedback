import { CredentialModel } from "./model/credential-model";

export interface ICredentialDatabase {
    findCredentialByUserId(login: string): Promise<CredentialModel>;
}