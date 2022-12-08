import { Role } from "../../credential/data/role";

export class LoggedUser {
    constructor(
        public readonly id: string = "",
        public readonly name: string = "",
        public readonly roles: Role[] = []
    ) { }

    static readonly empty = new LoggedUser();
}