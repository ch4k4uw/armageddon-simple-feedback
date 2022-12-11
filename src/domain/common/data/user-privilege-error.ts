export class UserPrivilegeError extends Error {
    constructor() {
        super("not enough level privilege")
    }
}