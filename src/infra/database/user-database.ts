import { UserModel } from "./model/user-model"

export interface IUserDatabase {
    findUserById(id: string): Promise<UserModel|null>;
}