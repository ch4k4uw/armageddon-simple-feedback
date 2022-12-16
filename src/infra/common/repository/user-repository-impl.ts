import { User } from "../../../domain/common/entity/user";
import { IUserRepository } from "../../../domain/common/repository/user-repository";
import { IUserDatabase } from "../../database/user-database";

export class UserRepositoryImpl implements IUserRepository {
    constructor(private database: IUserDatabase) { }

    async findById(id: string): Promise<User> {
        const result = await this.database.findUserById(id);
        if (result === null) {
            return User.empty;
        }
        return result.asDomain;
    }

}