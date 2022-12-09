import { UserNotFoundError } from "../../domain/common/data/user-not-found-error";
import { User } from "../../domain/common/entity/user";
import { IUserRepository } from "../../domain/common/repository/user-repository";
import { ExpiredAccessTokenError } from "../../domain/token/data/expired-access-token-error";
import { InvalidAccessTokenError } from "../../domain/token/data/invalid-access-token-error";
import { JwToken } from "../../domain/token/data/jw-token";

export class FindLoggedUserApp {
    constructor(
        private userRepository: IUserRepository
    ) { }

    async find(token: JwToken): Promise<User> {
        if (!token.isValid) {
            throw new InvalidAccessTokenError();
        }
        if (token.isExpired) {
            throw new ExpiredAccessTokenError();
        }
        const result = await this.userRepository.findById(token.loggedUser.id);
        if (result === User.empty) {
            throw new UserNotFoundError();
        }
        return result;
    }
}