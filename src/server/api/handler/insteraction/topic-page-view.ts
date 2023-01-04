import { TopicPage } from "../../../../domain/feedback/data/topic-page";
import { PageView } from "./page-view";
import { TopicView } from "./topic-view";

export class TopicPageView extends PageView<TopicView> {
    constructor(topicPage: TopicPage) {
        super(
            topicPage.topics.map(e => new TopicView(e)),
            topicPage.size,
            topicPage.index,
            topicPage.total,
        );
    }
}