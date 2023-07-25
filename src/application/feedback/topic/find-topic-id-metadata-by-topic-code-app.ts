import { Inject, Service } from "typedi";
import { TopicNotFoundError } from "../../../domain/feedback/data/topic-not-found-error";
import { TopicIdMetadata } from "../../../domain/feedback/entity/topic-id-metadata";
import { ITopicIdMetadataRepository } from "../../../domain/feedback/repository/topic-id-metadata-repository";
import { IoCId } from "../../../ioc/ioc-id";
import { AccessTokenAssertionApp } from "../common/access-token-assertion-app";
import { Role } from "../../../domain/credential/data/role";
import { JwToken } from "../../../domain/token/entity/jw-token";

@Service()
export class FindTopicIdMetadataByTopicCodeApp extends AccessTokenAssertionApp {
    constructor(
        @Inject(IoCId.Infra.TOPIC_ID_METADATA_REPOSITORY)
        private repository: ITopicIdMetadataRepository,
    ) { 
        super([Role.admin, Role.guest]);
    }

    async find(token: JwToken, code: string): Promise<TopicIdMetadata> {
        this.assertToken(token);
        const result = await this.repository.findByTopicCode(code);
        if (result === TopicIdMetadata.empty) {
            throw new TopicNotFoundError();
        }
        return result;
    }
}