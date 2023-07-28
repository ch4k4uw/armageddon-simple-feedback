import Container, { ServiceOptions, Token } from "typedi";
import { DataSource } from "typeorm";
import { UserRepositoryImpl } from "../infra/common/repository/user-repository-impl";
import { CredentialRepositoryImpl } from "../infra/credential/repository/credential-repository-impl";
import { CryptoConfigProviderImpl } from "../infra/credential/service/crypto-config-provider-impl";
import { CryptoServiceImpl } from "../infra/credential/service/crypto-service-impl";
import { DatabaseImpl, defaultCreateIdFn } from "../infra/database/database-impl";
import { FeedbackCmdRepositoryImpl } from "../infra/feedback/repository/feedback-cmd-repository-impl";
import { TopicCmdRepositoryImpl } from "../infra/feedback/repository/topic-cmd-repository-impl";
import { NanoIdServiceImpl } from "../infra/feedback/service/nano-id-service-impl";
import { JwTokenCmdRepositoryImpl } from "../infra/token/repository/jw-token-cmd-repository-impl";
import { JwTokenKeyProviderImpl } from "../infra/token/service/jw-token-key-provider-impl";
import { JwTokenServiceImpl } from "../infra/token/service/jw-token-service-impl";
import { IoCId } from "./ioc-id";
import { TopicIdMetadataRepositoryImpl } from "../infra/feedback/repository/topic-id-metadata-repository-impl";

export namespace IoC {
    export function registerDomainServices(dataSource: DataSource) {
        registerServices([
            { id: IoCId.Infra.DATA_SOURCE, value: dataSource },

            { id: IoCId.Infra.NANO_ID_SVC, type: NanoIdServiceImpl },
            { id: IoCId.Infra.CRYPTO_SVC, type: CryptoServiceImpl },
            { id: IoCId.Infra.JW_TOKEN_SVC, type: JwTokenServiceImpl },

            { id: IoCId.Infra.DATABASE, type: DatabaseImpl },
            { id: IoCId.Infra.DATABASE_ID_CREATOR, value: defaultCreateIdFn },

            { id: IoCId.Infra.CRYPTO_CONFIG_PROVIDER, type: CryptoConfigProviderImpl },
            { id: IoCId.Infra.JW_TOKEN_KEY_PROVIDER, type: JwTokenKeyProviderImpl },
            
            { id: IoCId.Infra.USER_REPOSITORY, type: UserRepositoryImpl },
            { id: IoCId.Infra.CREDENTIAL_REPOSITORY, type: CredentialRepositoryImpl },
            { id: IoCId.Infra.JW_TOKEN_REPOSITORY, type: JwTokenCmdRepositoryImpl },
            {
                id: IoCId.Infra.JW_TOKEN_CMD_REPOSITORY,
                factory: () => Container.get(IoCId.Infra.JW_TOKEN_REPOSITORY)
            },
            { id: IoCId.Infra.TOPIC_REPOSITORY, type: TopicCmdRepositoryImpl },
            {
                id: IoCId.Infra.TOPIC_CMD_REPOSITORY,
                factory: () => Container.get(IoCId.Infra.TOPIC_REPOSITORY)
            },
            { id: IoCId.Infra.FEEDBACK_REPOSITORY, type: FeedbackCmdRepositoryImpl },
            {
                id: IoCId.Infra.FEEDBACK_CMD_REPOSITORY,
                factory: () => Container.get(IoCId.Infra.FEEDBACK_REPOSITORY)
            },
            { id: IoCId.Infra.TOPIC_ID_METADATA_REPOSITORY, type: TopicIdMetadataRepositoryImpl },
        ]);
    }

    export function registerServices(services: Array<ServiceOptions>) {
        services.forEach(service => Container.set(service));
    }
}