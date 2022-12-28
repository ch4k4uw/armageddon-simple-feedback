import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from "typeorm";
import { JwRefreshTokenEntity } from "./jw-refresh-token.entity";

@Entity("user")
export class UserEntity {
    @PrimaryColumn()
    id: string;

    @Column("text")
    firstName: string;

    @Column("text")
    lastName: string;

    @Column("text")
    email: string;

    @Column("integer")
    created: number;

    @Column("integer")
    updated: number;

    @OneToMany(() => JwRefreshTokenEntity, token => token.user)
    tokens: JwRefreshTokenEntity[];
}