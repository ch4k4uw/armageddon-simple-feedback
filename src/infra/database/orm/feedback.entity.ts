import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { TopicEntity } from "./topic.entity";

@Entity("feedback")
@Index(["rating", "lowerReason"])
export class FeedbackEntity {
    @PrimaryColumn("text")
    id: string;

    @Column("text")
    topicId: string;

    @ManyToOne(() => TopicEntity, topic => topic.feedback)
    @JoinColumn({name: "topicId"})
    topic: TopicEntity;

    @Column("integer")
    @Index()
    rating: number;

    @Column("text")
    reason: string;

    @Column("text")
    @Index()
    lowerReason: string;

    @Column("integer")
    @Index()
    created: number;
}