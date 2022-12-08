import { User } from "../entity/user";

export interface IUserRepository {
    findById(id: string): Promise<User>;
}