import { anyNumber, anything, mock, when } from "ts-mockito";
import { FeedbackPage } from "../../../../../src/domain/feedback/data/feedback-page";
import { IDatabase } from "../../../../../src/infra/database/database";
import { FeedbackModel } from "../../../../../src/infra/database/model/feedback-model";
import { PagedModel } from "../../../../../src/infra/database/model/paged-model";
import { CommonFeedbackFixture } from "../../stuff/common-feedback-fixture";

export namespace FeedbackFixture {
    export namespace FindPage {
        export class Success {
            private constructor() { }
            static get topic() {
                return CommonFeedbackFixture.Common.topic1;
            }

            static get page() {
                return new PagedModel<FeedbackModel>(
                    [CommonFeedbackFixture.Common.feedback1, CommonFeedbackFixture.Common.feedback2, CommonFeedbackFixture.Common.feedback3],
                    10,
                    1,
                    3
                );
            }

            static get pageDomain() {
                return new FeedbackPage(
                    this.page.result.map((v) => v.asDomain),
                    this.page.size,
                    this.page.index,
                    this.page.total,
                );
            }
        }

        export class TopicNotFound {
            private constructor() { }
            static get topic() {
                return CommonFeedbackFixture.Common.topic2;
            }
        }
    }

    export namespace FindById {
        export class Success {
            private constructor() { }

            static get feedback() {
                return CommonFeedbackFixture.Common.feedback1;
            }
        }

        export class NotFound {
            private constructor() { }

            static get feedback() {
                return CommonFeedbackFixture.Common.feedback2;
            }
        }
    }

    export namespace Insert {
        export class Success {
            private constructor() { }

            static get topic() {
                return CommonFeedbackFixture.Common.topic1;
            }

            static get feedback() {
                return CommonFeedbackFixture.Common.feedback1;
            }

            static get feedbackDomain() {
                return CommonFeedbackFixture.Common.feedback1.asDomain;
            }
        }

        export class TopicNotFound {
            private constructor() { }

            static get topic() {
                return CommonFeedbackFixture.Common.topic2;
            }

            static get feedbackDomain() {
                return CommonFeedbackFixture.Common.feedback11.asDomain;
            }
        }

        export class TopicExpired {
            private constructor() { }

            static get topic() {
                return CommonFeedbackFixture.Common.topic10;
            }

            static get feedbackDomain() {
                return CommonFeedbackFixture.Common.feedback21.asDomain;
            }
        }
    }

    export function createDatabaseMock() {
        let database = mock<IDatabase>();
        when(database.createId()).thenCall(async () => CommonFeedbackFixture.findNextId());
        when(database.dateTime).thenCall(() => {
            return CommonFeedbackFixture.findCurrDate(1);
        });

        when(database.findTopicById(Insert.Success.topic.id)).thenResolve(Insert.Success.topic);
        when(database.findTopicById(Insert.TopicNotFound.topic.id)).thenCall(async () => null);
        when(database.findTopicById(Insert.TopicExpired.topic.id)).thenResolve(Insert.TopicExpired.topic);

        when(database.findFeedbackPage(FindPage.Success.topic.id, anyNumber(), anyNumber(), anything()))
            .thenResolve(FindPage.Success.page);
        when(database.findFeedbackPage(FindPage.TopicNotFound.topic.id, anyNumber(), anyNumber(), anything()))
            .thenCall(async () => null);
        when(database.findFeedbackById(FindById.Success.feedback.id)).thenResolve(FindById.Success.feedback);
        when(database.findFeedbackById(FindById.NotFound.feedback.id)).thenCall(async => null);

        when(database.insertFeedback(anything())).thenResolve();

        return database;
    }
}