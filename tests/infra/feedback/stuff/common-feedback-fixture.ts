import { FeedbackModel } from "../../../../src/infra/database/model/feedback-model";
import { TopicModel } from "../../../../src/infra/database/model/topic-model";
import { lazy } from "../../../util/framework";

export namespace CommonFeedbackFixture {
    let currDate: Date;
    export const findCurrDate = (minToAdd?: number, changeCurrent: boolean = true) => {
        if (currDate == undefined) {
            currDate = new Date();
        }
        const result = changeCurrent ? currDate : new Date(currDate.getTime());
        result.setMinutes(result.getMinutes() + (minToAdd || 0));
        return result;
    };

    let currId = 0;
    export const findNextId = () => `id.${++currId}`;

    export class Common {
        private constructor() { }
        private static readonly topic = lazy(() => {
            const topics: TopicModel[] = [];
            for (let i = 1; i <= 10; ++i) {
                const expirationTime = 60 * 24 * 10;
                const nonExpiredTime = i != 10 ? expirationTime : undefined;
                const expiredTime = i == 10 ? expirationTime * -1 : undefined;
                topics.push(
                    new TopicModel(
                        `id${i}`,
                        `a${i}`,
                        `b${i}`,
                        `c${i}`,
                        `d${i}`,
                        `e${i}`,
                        findCurrDate(nonExpiredTime || expiredTime, false).getTime(),
                        findCurrDate().getTime(),
                        findCurrDate().getTime()
                    )
                )
            }
            return topics;
        });

        private static readonly feedback = lazy(() => {
            const feedback: FeedbackModel[] = [];
            for (let i = 1; i <= 30; ++i) {
                const topic1 = i <= 10 ? Common.topic.value[0] : undefined;
                const topic2 = i <= 20 ? Common.topic.value[1] : undefined;
                const topic10 = i > 20 ? Common.topic.value[9] : undefined;
                feedback.push(
                    new FeedbackModel(
                        `a${i}`,
                        (topic1 || topic2 || topic10 || {}).id,
                        i < 7 ? 3 : i < 11 ? 5 : 2,
                        `b${i}`,
                        findCurrDate(i, false).getTime()
                    )
                )
            }
            return feedback;
        });

        static get topic1() {
            return this.topic.value[0];
        }

        static get topic2() {
            return this.topic.value[1];
        }

        static get topic10() {
            return this.topic.value[9];
        }

        static get feedback1() {
            return this.feedback.value[0];
        }

        static get feedback2() {
            return this.feedback.value[1];
        }

        static get feedback3() {
            return this.feedback.value[2];
        }

        static get feedback11() {
            return this.feedback.value[10];
        }

        static get feedback21() {
            return this.feedback.value[20];
        }
    }
}