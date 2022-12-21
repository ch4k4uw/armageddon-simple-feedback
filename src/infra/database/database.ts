import { ICredentialDatabase } from "./credential-database";
import { IFeedbackDatabase } from "./feedback-database";
import { IJwTokenDatabase } from "./jw-token-database";
import { ITopicDatabase } from "./topic-database";
import { IUserDatabase } from "./user-database"

export interface IDatabase extends
    IJwTokenDatabase,
    IUserDatabase,
    ICredentialDatabase,
    ITopicDatabase,
    IFeedbackDatabase {
    createId(): Promise<string>;
    readonly dateTime: number;
}