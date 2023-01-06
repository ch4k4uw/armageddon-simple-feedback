import { Credential } from "../../../domain/credential/data/credential";
import { Role } from "../../../domain/credential/data/role";

export class CredentialModel {
    constructor(
        public readonly user: string = "",
        public readonly login: string = "",
        public readonly password: string = "",
        public readonly roles: string[] = [],
    ) { }

    get asDomain() {
        return new Credential(
            this.user,
            this.login,
            this.roles.map(v => [
                Object.keys(Role).filter(k => isNaN(parseInt(k))).findIndex(k => k === v)
            ][0]),
        );
    }
}