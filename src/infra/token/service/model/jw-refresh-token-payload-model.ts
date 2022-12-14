import { LoggedUser } from "../../../../domain/common/entity/logged-user";

export class JwRefreshTokenPayloadModel {
    constructor(
        public readonly id: string,
        public readonly loggedUser: LoggedUser,
    ) { }
}