import { Topic } from "../../../domain/feedback/entity/topic";

export class TopicModel {
    constructor(
        public readonly id: string = "",
        public readonly code: string = "",
        public readonly title: string = "",
        public readonly description: string = "",
        public readonly author: string = "",
        public readonly authorName: string = "",
        public readonly expires: number = Date.now(),
        public readonly created: number = Date.now(),
        public readonly updated: number = Date.now(),
    ) { }

    get asDomain(): Topic {
        return new Topic(
            this.id,
            this.code,
            this.title,
            this.description,
            this.author,
            this.authorName,
            new Date(this.expires),
            new Date(this.created),
            new Date(this.updated),
        );
    }
}