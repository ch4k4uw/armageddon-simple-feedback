import Container from "typedi";
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

export namespace IoC {
    export function registerServices(dataSource: DataSource) {
        Container.set({ id: IoCId.Infra.DATA_SOURCE, value: dataSource });

        Container.set({ id: IoCId.Infra.NANO_ID_SVC, type: NanoIdServiceImpl });
        Container.set({ id: IoCId.Infra.CRYPTO_SVC, type: CryptoServiceImpl });
        Container.set({ id: IoCId.Infra.JW_TOKEN_SVC, type: JwTokenServiceImpl });

        Container.set({ id: IoCId.Infra.DATABASE, type: DatabaseImpl });
        Container.set({ id: IoCId.Infra.DATABASE_ID_CREATOR, value: defaultCreateIdFn });

        Container.set({ id: IoCId.Infra.CRYPTO_CONFIG_PROVIDER, type: CryptoConfigProviderImpl });
        Container.set({ id: IoCId.Infra.JW_TOKEN_KEY_PROVIDER, type: JwTokenKeyProviderImpl });
        
        Container.set({ id: IoCId.Infra.USER_REPOSITORY, type: UserRepositoryImpl });
        Container.set({ id: IoCId.Infra.CREDENTIAL_REPOSITORY, type: CredentialRepositoryImpl });
        Container.set({ id: IoCId.Infra.JW_TOKEN_REPOSITORY, type: JwTokenCmdRepositoryImpl });
        Container.set({
            id: IoCId.Infra.JW_TOKEN_CMD_REPOSITORY,
            factory: () => Container.get(IoCId.Infra.JW_TOKEN_REPOSITORY)
        });
        Container.set({ id: IoCId.Infra.TOPIC_REPOSITORY, type: TopicCmdRepositoryImpl });
        Container.set({
            id: IoCId.Infra.TOPIC_CMD_REPOSITORY,
            factory: () => Container.get(IoCId.Infra.TOPIC_REPOSITORY)
        });
        Container.set({ id: IoCId.Infra.FEEDBACK_REPOSITORY, type: FeedbackCmdRepositoryImpl });
        Container.set({
            id: IoCId.Infra.FEEDBACK_CMD_REPOSITORY,
            factory: () => Container.get(IoCId.Infra.FEEDBACK_REPOSITORY)
        });
    }
}