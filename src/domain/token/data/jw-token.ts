import { LoggedUser } from "../../common/entity/logged-user";

export class JwToken {
    constructor(
        public readonly loggedUser: LoggedUser = LoggedUser.empty,
        public readonly isExpired: boolean = true,
        public readonly isValid: boolean = false,
    ) { }

    static readonly empty = new JwToken();

    cloneWith(
        loggedUser?: LoggedUser,
        isExpired?: boolean,
        isValid?: boolean,
    ): JwToken {
        loggedUser = loggedUser || this.loggedUser;
        isExpired = isExpired == undefined ? this.isExpired : isExpired;
        isValid = isValid == undefined ? this.isValid : isValid;
        return new JwToken(loggedUser, isExpired, isValid);
    }
}