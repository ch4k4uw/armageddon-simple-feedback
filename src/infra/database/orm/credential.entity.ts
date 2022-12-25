import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("credential")
export class CredentialEntity {
    static readonly ROLE_ADMIN = 1;

    @PrimaryColumn("text")
    userId: string;

    @OneToOne(() => UserEntity)
    @JoinColumn({name: "userId"})
    user: UserEntity;

    @Column("text")
    login: string;

    @Column("text")
    password: string;

    @Column("integer")
    role: number;
}