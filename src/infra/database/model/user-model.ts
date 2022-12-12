import { emitWarning } from "process";
import { User } from "../../../domain/common/entity/user";

export class UserModel {
    constructor (
        public readonly id: string = "",
        public readonly firstName: string = "",
        public readonly lastName: string = "",
        public readonly email: string = "",
        public readonly created: number = 0,
        public readonly updated: number = 0,
    ) { }

    static readonly empty = new UserModel();

    get asDomain(): User {
        return new User(
            this.id,
            this.firstName,
            this.lastName,
            this.email,
        );
    }
}