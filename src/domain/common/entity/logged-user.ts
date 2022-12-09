import { Role } from "../../credential/data/role";

export class LoggedUser {
    constructor(
        public readonly id: string = "",
        public readonly name: string = "",
        public readonly roles: Role[] = []
    ) { }

    static readonly empty = new LoggedUser();

    cloneWith(
        id?: string,
        name?: string,
        roles?: Role[],
    ): LoggedUser {
        id = id == undefined ? this.id : id;
        name = name == undefined ? this.name : name;
        roles = roles == undefined ? this.roles : roles;
        return new LoggedUser(id, name, roles);
    }
}