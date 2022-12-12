import { LoggedUser } from "../../common/entity/logged-user";

export class JwToken {
    constructor(
        public readonly id: string = "",
        public readonly loggedUser: LoggedUser = LoggedUser.empty,
        public readonly isExpired: boolean = true,
        public readonly isValid: boolean = false,
    ) { }

    static readonly empty = new JwToken();

    cloneWith(
        id?: string,
        loggedUser?: LoggedUser,
        isExpired?: boolean,
        isValid?: boolean,
    ): JwToken {
        id = id == undefined ? this.id : id;
        loggedUser = loggedUser == undefined ?  this.loggedUser : loggedUser;
        isExpired = isExpired == undefined ? this.isExpired : isExpired;
        isValid = isValid == undefined ? this.isValid : isValid;
        return new JwToken(id, loggedUser, isExpired, isValid);
    }
}