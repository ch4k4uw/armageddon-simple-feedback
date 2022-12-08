export class InvalidUserOrPasswordError extends Error {
    constructor() {
        super("invalid user or password");
    }
}