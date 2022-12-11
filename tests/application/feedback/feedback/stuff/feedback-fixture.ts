import { anyNumber, anyString, anything, when } from "ts-mockito";
import { FeedbackQuery } from "../../../../../src/application/feedback/common/data/feedback-query";
import { FeedbackRegistration } from "../../../../../src/application/feedback/feedback/data/feedback-registration";
import { FeedbackConstants } from "../../../../../src/domain/feedback/data/feedback-constants";
import { FeedbackPage } from "../../../../../src/domain/feedback/data/feedback-page";
import { Feedback } from "../../../../../src/domain/feedback/entity/feedback";
import { IFeedbackCmdRepository } from "../../../../../src/domain/feedback/repository/feedback-cmd-repository";
import { IFeedbackRepository } from "../../../../../src/domain/feedback/repository/feedback-repository";
import { CommonFixture } from "../../../common/stuff/common-fixture";

export namespace FeedbackFixture {
    class Common {
        static get feedback1() {
            return new Feedback(
                "a1", "b1", 3, "c1",
            );
        }

        static get feedback2() {
            return new Feedback(
                "a2", "b2", 3, "c2",
            );
        }

        static get feedback3() {
            return new Feedback(
                "a3", "b3", 3, "c3",
            );
        }
    }

    export class Find {
        private constructor() { }
        static get successFeedbackQuery() {
            return new FeedbackQuery("a1", 10, 1);
        }

        static get invalidPageIndexFeedbackQuery() {
            return new FeedbackQuery("a2", 10, -1);
        }

        static get invalidPageSizeFeedbackQuery() {
            return new FeedbackQuery("a3", -10, 1);
        }

        static get successFeedbackPage() {
            const arrResult = [Common.feedback1, Common.feedback2, Common.feedback3];
            return new FeedbackPage(
                arrResult,
                10,
                1,
                arrResult.length
            )
        }

        static get successAccessToken() {
            return CommonFixture.jwToken1;
        }
        
        static get invalidAccessToken() {
            return this.successAccessToken.cloneWith(undefined, false, false);
        }
        
        static get expiredAccessToken() {
            return this.successAccessToken.cloneWith(undefined, true, true);
        }
    }

    export class FindById {
        private constructor() { }
        static get successFeedbackId() {
            return Common.feedback1.id;
        
        
        }static get notFoundFeedbackId() {
            return Common.feedback2.id;
        }

        static get successAccessToken() {
            return Find.successAccessToken;
        }
        
        static get invalidAccessToken() {
            return Find.invalidAccessToken;
        }
        
        static get expiredAccessToken() {
            return Find.expiredAccessToken;
        }

        static get successFeedback() {
            return Common.feedback1;
        }
    }

    export class Register {
        private constructor() { }
        static get successFeedbackRegistration() {
            return new FeedbackRegistration(
                "a1",
                FeedbackConstants.maxRatingValue,
                "b1",
            );
        }

        static get invalidReasonFeedbackRegistration() {
            let reason = "";
            for (let i=0; i <= FeedbackConstants.maxFeedbackReasonLength; ++i) {
                reason += "c1";
            }
            return new FeedbackRegistration(
                "a2",
                FeedbackConstants.maxRatingValue,
                reason,
            );
        }

        static get invalidRatingFeedbackRegistration1() {
            return new FeedbackRegistration(
                "a3",
                FeedbackConstants.maxRatingValue + 1,
                "b3",
            );
        }
        
        static get invalidRatingFeedbackRegistration2() {
            return new FeedbackRegistration(
                "a4",
                FeedbackConstants.minRatingValue - 1,
                "b4",
            );
        }

        static get successFeedback() {
            return FindById.successFeedback;
        }
    }

    export function setupFeedbackRepository(repository: IFeedbackRepository): void;
    export function setupFeedbackRepository(repository: IFeedbackCmdRepository): void;
    export function setupFeedbackRepository(repository: IFeedbackCmdRepository | IFeedbackRepository): void {
        when(repository.find(anyString(), anyNumber(), anyNumber())).thenResolve(Find.successFeedbackPage);
        when(repository.findById(FindById.successFeedbackId)).thenResolve(FindById.successFeedback);
        when(repository.findById(FindById.notFoundFeedbackId)).thenResolve(Feedback.empty);
        const cmdRepository = repository as IFeedbackCmdRepository;
        when(cmdRepository.insert(anything())).thenResolve(Register.successFeedback);
    }
}