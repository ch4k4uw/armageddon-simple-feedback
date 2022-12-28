import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { UserEntity } from "./user.entity"

@Entity("jw-refresh-token")
export class JwRefreshTokenEntity {
    @PrimaryColumn("text")
    public id: string

    @ManyToOne(() => UserEntity, user => user.tokens)
    @JoinColumn({name: "userId"})
    public user: UserEntity;

    @Column("boolean")
    public removed: boolean;

    @Column("integer")
    public created: number;

    @Column("integer")
    public updated: number;
}