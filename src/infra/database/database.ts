import { ICredentialDatabase } from "./credential-database";
import { IJwTokenDatabase } from "./jw-token-database";
import { IUserDatabase } from "./user-database"

export interface IDatabase extends IJwTokenDatabase, IUserDatabase, ICredentialDatabase {
    createId(): Promise<string>;
}