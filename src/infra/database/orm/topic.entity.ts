import { Column, Entity, Index, OneToMany, PrimaryColumn } from "typeorm";
import { FeedbackEntity } from "./feedback.entity";

@Entity("topic")
@Index(["lowerTitle", "lowerDescription"])
export class TopicEntity {
    @PrimaryColumn("text")
    id: string;

    @Column("text")
    code: string;

    @Column("text")
    title: string;

    @Column("text")
    @Index()
    lowerTitle: string;

    @Column("text")
    description: string;

    @Column("text")
    @Index()
    lowerDescription: string;

    @Column("text")
    author: string;

    @Column("text")
    authorName: string;

    @Column("integer")
    expires: number;

    @Column("integer")
    created: number;

    @Column("integer")
    updated: number;

    @OneToMany(() => FeedbackEntity, feedback => feedback.topic)
    feedback: FeedbackEntity[];
}