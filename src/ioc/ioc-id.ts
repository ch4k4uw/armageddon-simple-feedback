import { Token } from "typedi";
import { DataSource } from "typeorm";
import { IUserRepository } from "../domain/common/repository/user-repository";
import { ICredentialRepository } from "../domain/credential/repository/credential-repository";
import { IJwTokenCmdRepository } from "../domain/token/repository/jw-token-cmd-repository";
import { IJwTokenRepository } from "../domain/token/repository/jw-token-repository";
import { ICryptoConfigProvider } from "../infra/credential/service/crypto-config-provider";
import { ICryptoService } from "../infra/credential/service/crypto-service";
import { IDatabase } from "../infra/database/database";
import { INanoIdService } from "../infra/feedback/service/nano-id-service";
import { IJwTokenKeyProvider } from "../infra/token/service/jw-token-key-provider";
import { IJwTokenService } from "../infra/token/service/jw-token-service";
import { ITopicIdMetadataRepository } from "../domain/feedback/repository/topic-id-metadata-repository";

export namespace IoCId {
    export namespace Infra {
        export const DATA_SOURCE = new Token<DataSource>('infra.database.data-source');

        export const NANO_ID_SVC = new Token<INanoIdService>('infra.service.nano-id');
        export const CRYPTO_SVC = new Token<ICryptoService>('infra.service.crypto');
        export const JW_TOKEN_SVC = new Token<IJwTokenService>('infra.service.jw-token');

        export const DATABASE = new Token<IDatabase>('infra.database');
        export const DATABASE_ID_CREATOR = new Token<() => Promise<string>>('infra.database.id.creator');

        export const CRYPTO_CONFIG_PROVIDER = new Token<ICryptoConfigProvider>('infra.provider.crypto-config');
        export const JW_TOKEN_KEY_PROVIDER = new Token<IJwTokenKeyProvider>('infra.provider.jw-token-key');

        export const USER_REPOSITORY = new Token<IUserRepository>('infra.repository.user');
        export const CREDENTIAL_REPOSITORY = new Token<ICredentialRepository>('infra.repository.credential');
        export const JW_TOKEN_REPOSITORY = new Token<IJwTokenRepository>('infra.repository.jw-refresh-token');
        export const JW_TOKEN_CMD_REPOSITORY = new Token<IJwTokenCmdRepository>('infra.repository.cmd.jw-refresh-token');
        export const TOPIC_REPOSITORY = new Token<IJwTokenCmdRepository>('infra.repository.topic');
        export const TOPIC_CMD_REPOSITORY = new Token<IJwTokenCmdRepository>('infra.repository.cmd.topic');
        export const FEEDBACK_REPOSITORY = new Token<IJwTokenCmdRepository>('infra.repository.feedback');
        export const FEEDBACK_CMD_REPOSITORY = new Token<IJwTokenCmdRepository>('infra.repository.cmd.feedback');
        export const TOPIC_ID_METADATA_REPOSITORY = new Token<ITopicIdMetadataRepository>('infra.repository.topic-id-metadata');
    }
    export const FIND_LOGGED_USER_APP = new Token('app.find-logged-user');
    export const SIGN_IN_APP = new Token('app.sign-in');
}