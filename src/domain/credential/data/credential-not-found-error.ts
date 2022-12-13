export class CredentialNotFoundError extends Error {
    constructor() {
        super("credential not found");
    }
}