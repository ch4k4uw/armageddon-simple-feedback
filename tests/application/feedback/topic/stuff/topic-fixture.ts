import { anything, when } from "ts-mockito";
import { FeedbackQuery } from "../../../../../src/application/feedback/common/data/feedback-query";
import { TopicRegistration } from "../../../../../src/application/feedback/topic/data/topic-registration";
import { TopicUpdate } from "../../../../../src/application/feedback/topic/data/topic-update";
import { TopicPage } from "../../../../../src/domain/feedback/data/topic-page";
import { TopicSummary } from "../../../../../src/domain/feedback/data/topic-summary";
import { Topic } from "../../../../../src/domain/feedback/entity/topic";
import { ITopicCmdRepository } from "../../../../../src/domain/feedback/repository/topic-cmd-repository";
import { ITopicRepository } from "../../../../../src/domain/feedback/repository/topic-repository";
import { CommonFixture } from "../../../common/stuff/common-fixture";

export namespace TopicFixture {
    class Common {
        private static readonly currentDate = new Date();

        static get date1() {
            return new Date(this.currentDate.getTime());
        }

        static get expiresInDaysCount() {
            return 90;
        }

        static get topic1() {
            const expiresIn = this.date1;
            expiresIn.setDate(expiresIn.getDate() + this.expiresInDaysCount);
            return new Topic(
                "a1",
                "b1",
                "c1",
                "d1",
                CommonFixture.jwToken1.loggedUser.id,
                CommonFixture.jwToken1.loggedUser.name,
                expiresIn,
                this.date1,
                this.date1
            );
        }

        static get topic2() {
            const expiresIn = this.date1;
            expiresIn.setDate(expiresIn.getDate() + this.expiresInDaysCount);
            return new Topic(
                "a2",
                "b2",
                "c2",
                "d2",
                CommonFixture.jwToken1.loggedUser.id,
                CommonFixture.jwToken1.loggedUser.name,
                expiresIn,
                this.date1,
                this.date1
            );
        }

        static get topic3() {
            const expiresIn = this.date1;
            expiresIn.setDate(expiresIn.getDate() + this.expiresInDaysCount);
            return new Topic("a3",
                "b3",
                "c3",
                "d3",
                CommonFixture.jwToken1.loggedUser.id,
                CommonFixture.jwToken1.loggedUser.name,
                expiresIn,
                this.date1,
                this.date1
            );
        }

        static get topicPage1() {
            const arrResult = [this.topic1, this.topic2, this.topic3];
            return new TopicPage(
                arrResult,
                10,
                1,
                arrResult.length
            );
        }
    }

    export class Find {
        private constructor() { }
        static get successAccessToken() {
            return CommonFixture.jwToken1;
        }

        static get invalidAccessToken() {
            return this.successAccessToken.cloneWith(undefined, undefined, false, false);
        }

        static get expiredAccessToken() {
            return this.invalidAccessToken.cloneWith(undefined, undefined, true, true);
        }

        static get successTopicQuery() {
            return new FeedbackQuery("a1", 10, 1);
        }

        static get invalidPageSizeTopicQuery() {
            return new FeedbackQuery("a1", -10, 1);
        }

        static get invalidPageIndexTopicQuery() {
            return new FeedbackQuery("a1", 10, -1);
        }

        static get successTopicPage() {
            return Common.topicPage1;
        }
    }

    export class FindByCode {
        private constructor() { }
        static get successCode() {
            return Common.topic1.code;
        }

        static get topicNotFoundCode() {
            return Common.topic2.code;
        }

        static get successTopic() {
            return Common.topic1;
        }
    }

    export class FindById {
        private constructor() { }
        static get successAccessToken() {
            return Find.successAccessToken;
        }

        static get invalidAccessToken() {
            return Find.invalidAccessToken;
        }

        static get expiredAccessToken() {
            return Find.expiredAccessToken;
        }

        static get successId() {
            return Common.topic1.id;
        }

        static get topicNotFoundId() {
            return Common.topic2.id;
        }

        static get successTopic() {
            return Common.topic1;
        }
    }

    export class FindSummary {
        private constructor() { }
        static get successAccessToken() {
            return FindById.successAccessToken;
        }

        static get invalidAccessToken() {
            return FindById.invalidAccessToken;
        }

        static get expiredAccessToken() {
            return FindById.expiredAccessToken;
        }

        static get successId() {
            return FindById.successId;
        }

        static get topicNotFoundId() {
            return FindById.topicNotFoundId;
        }

        static get successTopic() {
            return new TopicSummary(
                FindById.successTopic,
                Common.expiresInDaysCount,
                1,
                2,
                3,
                4,
            );
        }
    }

    export class RegisterTopic {
        private constructor() { }
        static get successAccessToken() {
            return FindSummary.successAccessToken;
        }

        static get invalidAccessToken() {
            return FindSummary.invalidAccessToken;
        }

        static get expiredAccessToken() {
            return FindSummary.expiredAccessToken;
        }

        static get successTopicRegistration() {
            return new TopicRegistration(
                Common.topic1.title,
                Common.topic1.description,
                Common.topic1.expires,
            );
        }

        static get successIntermediaryTopicRegistration() {
            return new Topic(
                undefined,
                undefined,
                this.successTopicRegistration.title,
                this.successTopicRegistration.description,
                Common.topic1.author,
                Common.topic1.authorName,
                this.successTopicRegistration.expiration,
            );
        }

        static get expiredTopicRegistration() {
            const date = new Date();
            date.setHours(date.getHours() - 1);
            return new TopicRegistration(
                Common.topic2.title,
                Common.topic2.description,
                date,
            );
        }

        static get successTopic() {
            return Common.topic1;
        }
    }

    export class RemoveTopic {
        private constructor() { }
        static get successAccessToken() {
            return RegisterTopic.successAccessToken;
        }

        static get invalidAccessToken() {
            return RegisterTopic.invalidAccessToken;
        }

        static get expiredAccessToken() {
            return RegisterTopic.expiredAccessToken;
        }

        static get successTopicRemovalId() {
            return Common.topic1.id;
        }

        static get topicNotFoundRemovalId() {
            return Common.topic2.id;
        }

        static get successTopic() {
            return Common.topic1;
        }
    }

    export class UpdateTopic {
        private constructor() { }
        static get successAccessToken() {
            return RegisterTopic.successAccessToken;
        }

        static get invalidAccessToken() {
            return RegisterTopic.invalidAccessToken;
        }

        static get expiredAccessToken() {
            return RegisterTopic.expiredAccessToken;
        }

        static get successTopicUpdate() {
            return new TopicUpdate(
                Common.topic1.id,
                Common.topic1.title,
                Common.topic1.description,
                Common.topic1.expires,
            );
        }

        static get successIntermediaryTopicUpdate() {
            return new Topic(
                this.successTopicUpdate.id,
                undefined,
                this.successTopicUpdate.title,
                this.successTopicUpdate.description,
                undefined,
                undefined,
                this.successTopicUpdate.expiration
            );
        }

        static get topicNotFoundUpdate() {
            return new TopicUpdate(
                Common.topic2.id,
                Common.topic2.title,
                Common.topic2.description,
                Common.topic2.expires,
            );
        }

        static get expiredTopicUpdate() {
            const date = new Date();
            date.setHours(date.getHours() - 1);
            return new TopicUpdate(
                Common.topic1.id,
                Common.topic1.title,
                Common.topic1.description,
                date,
            );
        }

        static get successTopic() {
            return Common.topic1;
        }
    }

    export function setupTopicRepository(repository: ITopicRepository): void;
    export function setupTopicRepository(repository: ITopicCmdRepository): void;
    export function setupTopicRepository(repository: ITopicCmdRepository | ITopicRepository): void {
        when(
            repository.find(
                Find.successTopicQuery.query,
                anything(),
                anything()
            )
        ).thenResolve(Find.successTopicPage);
        when(
            repository.findByCode(
                FindByCode.successCode,
            )
        ).thenResolve(FindByCode.successTopic);
        when(
            repository.findByCode(
                FindByCode.topicNotFoundCode,
            )
        ).thenResolve(Topic.empty);
        when(repository.findById(FindById.successId))
            .thenResolve(FindById.successTopic);
        when(repository.findById(FindById.topicNotFoundId))
            .thenResolve(Topic.empty);
        when(repository.findSummary(FindSummary.successId))
            .thenResolve(FindSummary.successTopic);
        when(repository.findSummary(FindSummary.topicNotFoundId))
            .thenResolve(TopicSummary.empty);
        const cmdRepository = repository as ITopicCmdRepository;
        when(cmdRepository.insert(anything())).thenResolve(RegisterTopic.successTopic);
        when(cmdRepository.delete(RemoveTopic.successTopicRemovalId))
            .thenResolve(RemoveTopic.successTopic);
        when(cmdRepository.delete(RemoveTopic.topicNotFoundRemovalId))
            .thenResolve(Topic.empty);
        when(cmdRepository.update(anything())).thenCall(async (...args: any[]) => {
            const arg1 = args[0] as Topic;
            switch(arg1.title) {
                case UpdateTopic.successTopic.title:
                    return UpdateTopic.successTopic;
                default:
                    return Topic.empty;
            }
        });
    }
}