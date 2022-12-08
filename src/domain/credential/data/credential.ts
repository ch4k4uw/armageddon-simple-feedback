import { Role } from "./role";

export class Credential {
    constructor(
        public readonly user: string = "",
        public readonly login: string = "",
        public readonly roles: Role[] = [],
    ) { }

    static readonly empty = new Credential();
}