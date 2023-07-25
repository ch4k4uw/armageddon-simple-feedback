import { when } from "ts-mockito";
import { TopicNotFoundError } from "../../../../../src/domain/feedback/data/topic-not-found-error";
import { Topic } from "../../../../../src/domain/feedback/entity/topic";
import { TopicIdMetadata } from "../../../../../src/domain/feedback/entity/topic-id-metadata";
import { ITopicIdMetadataRepository } from "../../../../../src/domain/feedback/repository/topic-id-metadata-repository";
import { CommonFixture } from "../../../common/stuff/common-fixture";

export namespace TopicIdMetadataFixture {
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
            return new Topic(
                "a3",
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

        static get topicIdMetadata1() {
            return new TopicIdMetadata(
                this.topic1,
                "a1",
            );
        }
        
        static get topicIdMetadata2() {
            return new TopicIdMetadata(
                this.topic2,
                "a2",
            );
        }
    }

    export class FindByTopicCode {
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

        static get successCode() {
            return Common.topic1.code;
        }

        static get topicNotFoundCode() {
            return Common.topic2.code;
        }

        static get successTopicIdMetadata() {
            return Common.topicIdMetadata1;
        }
    }
    
    export class FindByTopicIdMetadata {
        private constructor() { }
        static get successTopicIdMetadata() {
            return Common.topicIdMetadata1.metadata;
        }

        static get topicIdMetadataNotFound() {
            return Common.topicIdMetadata2.metadata;
        }

        static get successTopic() {
            return Common.topicIdMetadata1;
        }
    }

    export function setupTopicIdMetadataRepository(repository: ITopicIdMetadataRepository): void {
        when(repository.findByTopicCode(FindByTopicCode.successCode))
            .thenResolve(FindByTopicCode.successTopicIdMetadata);
        when(repository.findByTopicCode(FindByTopicCode.topicNotFoundCode))
            .thenThrow(new TopicNotFoundError());
        when(repository.findByTopicIdMetadata(FindByTopicIdMetadata.successTopicIdMetadata))
            .thenResolve(FindByTopicIdMetadata.successTopic);
        when(repository.findByTopicIdMetadata(FindByTopicIdMetadata.topicIdMetadataNotFound))
            .thenThrow(new TopicNotFoundError());
    }
}