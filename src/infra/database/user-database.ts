import { UserModel } from "./model/user-model"

export interface IUserDatabase {
    findUserById(id: String): Promise<UserModel>;
}