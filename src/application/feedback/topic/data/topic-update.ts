import { TopicRegistration } from "./topic-registration";

export class TopicUpdate extends TopicRegistration {
    constructor(
        public id: string,
        title: string,
        description: string,
        expiration: Date,
    ) { 
        super(title, description, expiration);
    }
}