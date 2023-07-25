import { Response } from "express-serve-static-core";
import { Service } from "typedi";
import { FindTopicIdMetadataByTopicCodeApp } from "../../../application/feedback/topic/find-topic-id-metadata-by-topic-code-app";
import { IAuthRequest } from "../common/req-auth";
import { BaseAuthRequestHandler } from "./base-auth-request.handler";
import { TopicIdMetadataView } from "./insteraction/topic-id-metadata-view";

@Service()
export class RequestTopicIdMetadataByTopicCodeHandler extends BaseAuthRequestHandler {
    constructor(private findTopicIdMetadataByCodeApp: FindTopicIdMetadataByTopicCodeApp) {
        super();
    }

    async performHandling(req: IAuthRequest<{code: string}>, res: Response) {
        const result = await this.findTopicIdMetadataByCodeApp.find(req.auth.token, req.params.code);
        res.status(200).send(new TopicIdMetadataView(result));
    }
}