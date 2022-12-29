import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { UserEntity } from "./user.entity"

@Entity("jw-refresh-token")
export class JwRefreshTokenEntity {
    @PrimaryColumn("text")
    id: string

    @ManyToOne(() => UserEntity, user => user.tokens)
    @JoinColumn({name: "userId"})
    user: UserEntity;

    @Column("boolean")
    removed: boolean;

    @Column("integer")
    created: number;

    @Column("integer")
    updated: number;
}