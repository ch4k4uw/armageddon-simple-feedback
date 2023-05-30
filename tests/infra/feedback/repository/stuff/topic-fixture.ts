import { anyNumber, anyString, anything, mock, when } from "ts-mockito";
import { TopicPage } from "../../../../../src/domain/feedback/data/topic-page";
import { TopicSummary } from "../../../../../src/domain/feedback/data/topic-summary";
import { Topic } from "../../../../../src/domain/feedback/entity/topic";
import { IDatabase } from "../../../../../src/infra/database/database";
import { PagedModel } from "../../../../../src/infra/database/model/paged-model";
import { FeedbackInfraConstants } from "../../../../../src/infra/feedback/repository/feedback-infra-constants";
import { INanoIdService } from "../../../../../src/infra/feedback/service/nano-id-service";
import { CommonFeedbackFixture } from "../../stuff/common-feedback-fixture";

export namespace TopicFixture {
    export namespace Insert {
        export class Success {
            private constructor() { }
            static get topicDomain() {
                return CommonFeedbackFixture.Common.topic1.asDomain;
            }
        }

        export class Duplication {
            private constructor() { }
            static get topicDomain() {
                return CommonFeedbackFixture.Common.topic2.asDomain;
            }
        }
    }

    export namespace Update {
        export class Success {
            private constructor() { }
            static get topic() {
                return CommonFeedbackFixture.Common.topic3;
            }

            static get topicDomain() {
                return CommonFeedbackFixture.Common.topic3.asDomain;
            }

            static get newTopicDomain() {
                return new Topic(
                    this.topicDomain.id,
                    undefined,
                    this.topicDomain.title,
                    this.topicDomain.description,
                    undefined,
                    undefined,
                    this.topicDomain.expires,
                    undefined,
                    this.topicDomain.updated,
                );
            }
        }

        export class NotFound {
            private constructor() { }
            static get topicDomain() {
                return CommonFeedbackFixture.Common.topic4.asDomain;
            }
        }

        export class Duplication {
            private constructor() { }
            static get topic() {
                return CommonFeedbackFixture.Common.topic5;
            }

            static get topicDomain() {
                return CommonFeedbackFixture.Common.topic5.asDomain;
            }
        }
    }

    export namespace Delete {
        export class Success {
            private constructor() { }
            static get topic() {
                return CommonFeedbackFixture.Common.topic1;
            }

            static get topicDomain() {
                return CommonFeedbackFixture.Common.topic1.asDomain;
            }
        }

        export class NotFound {
            private constructor() { }
            static get topicDomain() {
                return CommonFeedbackFixture.Common.topic2.asDomain;
            }
        }
    }

    export namespace Find {
        export class Success {
            private constructor() { }
            static get topicPageModel() {
                return new PagedModel(
                    [
                        CommonFeedbackFixture.Common.topic1,
                        CommonFeedbackFixture.Common.topic2,
                        CommonFeedbackFixture.Common.topic10,
                    ],
                    FeedbackInfraConstants.pageSize,
                    FeedbackInfraConstants.pageIndex,
                    3
                );
            }

            static get topicPageDomain() {
                return new TopicPage(
                    [
                        CommonFeedbackFixture.Common.topic1.asDomain,
                        CommonFeedbackFixture.Common.topic2.asDomain,
                        CommonFeedbackFixture.Common.topic10.asDomain,
                    ],
                    FeedbackInfraConstants.pageSize,
                    FeedbackInfraConstants.pageIndex,
                    3
                );
            }
        }
    }

    export namespace FindById {
        export class Success {
            private constructor() { }
            static get topic() {
                return CommonFeedbackFixture.Common.topic1;
            }

            static get topicDomain() {
                return CommonFeedbackFixture.Common.topic1.asDomain;
            }
        }

        export class NotFound {
            private constructor() { }
            static get topic() {
                return CommonFeedbackFixture.Common.topic2;
            }
        }
    }

    export namespace FindByCode {
        export class Success {
            private constructor() { }
            static get topic() {
                return CommonFeedbackFixture.Common.topic1;
            }

            static get topicDomain() {
                return CommonFeedbackFixture.Common.topic1.asDomain;
            }
        }

        export class NotFound {
            private constructor() { }
            static get topic() {
                return CommonFeedbackFixture.Common.topic2;
            }
        }
    }

    export namespace FindSummay {
        export class Success {
            private constructor() { }
            static get topic() {
                return CommonFeedbackFixture.Common.topic1;
            }

            static get feedbackSummaryList() {
                return CommonFeedbackFixture.Common.feedbackList.slice(0, 10);
            }

            static get feedbackSummary() {
                return new TopicSummary(
                    this.topic.asDomain,
                    10,
                    3.8,
                    5,
                    3,
                    10,
                    [0, 0, 6, 0, 4],
                );
            }
        }

        export class NotFound {
            private constructor() { }
            static get topic() {
                return CommonFeedbackFixture.Common.topic2;
            }
        }
    }

    export function createDatabaseMock() {
        const database = mock<IDatabase>();
        when(database.createId()).thenCall(async () => CommonFeedbackFixture.findNextId());
        when(database.dateTime).thenCall(() => {
            return CommonFeedbackFixture.findCurrDate(1);
        });

        when(database.findTopicExistsByTitle(Insert.Success.topicDomain.title)).thenResolve(false);
        when(database.findTopicExistsByTitle(Insert.Duplication.topicDomain.title)).thenResolve(true);
        when(database.findTopicExistsByTitle(Update.Success.topicDomain.title)).thenResolve(false);
        when(database.findTopicExistsByTitle(Update.NotFound.topicDomain.title)).thenResolve(false);
        when(database.findTopicExistsByTitle(Update.Duplication.topicDomain.title, Update.Duplication.topicDomain.id)).thenResolve(true);

        when(database.findTopicExistsByCode("code1")).thenResolve(true);
        when(database.findTopicExistsByCode("code2")).thenResolve(true);
        when(database.findTopicExistsByCode("code3")).thenResolve(true);
        when(database.findTopicExistsByCode("code4")).thenResolve(false);

        when(database.insertTopic(anything())).thenResolve();

        when(database.findTopicById(Update.Success.topic.id)).thenResolve(Update.Success.topic);
        when(database.findTopicById(Update.NotFound.topicDomain.id)).thenCall(async () => null);
        when(database.findTopicById(Update.Duplication.topicDomain.id)).thenResolve(Update.Duplication.topic);
        when(database.findTopicById(Delete.Success.topic.id)).thenResolve(Delete.Success.topic);
        when(database.findTopicById(Delete.NotFound.topicDomain.id)).thenCall(async () => null);

        when(database.updateTopic(anything())).thenResolve();

        when(database.removeTopicById(anyString())).thenResolve();

        when(database.findTopicPage(anyNumber(), anyNumber(), anything())).thenResolve(Find.Success.topicPageModel);

        when(database.findTopicById(FindById.Success.topic.id)).thenResolve(FindById.Success.topic);
        when(database.findTopicById(FindById.NotFound.topic.id)).thenCall(async () => null);

        when(database.findTopicByCode(FindByCode.Success.topic.id)).thenResolve(FindById.Success.topic);
        when(database.findTopicByCode(FindByCode.NotFound.topic.id)).thenCall(async () => null);

        when(database.findFeedbackSummariesByTopicId(FindSummay.Success.topic.id))
            .thenResolve(FindSummay.Success.feedbackSummaryList);
        when(database.findFeedbackSummariesByTopicId(FindSummay.NotFound.topic.id))
            .thenCall(async () => null);

        return database;
    }

    let currNanoId = 0;
    export function resetNanoId() {
        currNanoId = 0;
    }

    export function createNanoIdSvcMock() {
        const nanoIdSvc = mock<INanoIdService>();

        when(nanoIdSvc.createId()).thenCall(async () => {
            ++currNanoId;
            return `code${currNanoId}`;
        });

        return nanoIdSvc;
    }
}