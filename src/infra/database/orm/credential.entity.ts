import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("credential")
export class CredentialEntity {
    @PrimaryColumn("text")
    userId: string;

    @OneToOne(() => UserEntity)
    @JoinColumn({name: "userId"})
    user: UserEntity;

    @Column("text")
    login: string;

    @Column("integer")
    role: number;
}