import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { TopicEntity } from "./topic.entity";

@Entity("feedback")
export class FeedbackEntity {
    @PrimaryColumn("text")
    id: string;

    @ManyToOne(() => TopicEntity, topic => topic.feedback)
    @JoinColumn({name: "topicId"})
    topic: TopicEntity;

    @Column("integer")
    rating: number;

    @Column("text")
    reason: string;

    @Column("integer")
    created: number;
}