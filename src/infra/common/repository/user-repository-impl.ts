import { Inject } from "typedi";
import { User } from "../../../domain/common/entity/user";
import { IUserRepository } from "../../../domain/common/repository/user-repository";
import { IoCId } from "../../../ioc/ioc-id";
import { IUserDatabase } from "../../database/user-database";

export class UserRepositoryImpl implements IUserRepository {
    constructor(@Inject(IoCId.Infra.DATABASE) private database: IUserDatabase) { }

    async findById(id: string): Promise<User> {
        const result = await this.database.findUserById(id);
        if (result === null) {
            return User.empty;
        }
        return result.asDomain;
    }

}