import { LoggedUser } from "../../../../domain/common/entity/logged-user";

export class JwAccessTokenPayloadModel {
    constructor(
        public readonly loggedUser: LoggedUser,
    ) { }
}