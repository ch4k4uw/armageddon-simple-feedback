import { LoggedUser } from "../../common/entity/logged-user";

export class JwToken {
    constructor(
        public readonly loggedUser: LoggedUser = LoggedUser.empty,
        public readonly isExpired: boolean = true,
        public readonly isValid: boolean = false,
    ) { }

    static readonly empty = new JwToken();
}