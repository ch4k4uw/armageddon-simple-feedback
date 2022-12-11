export class InvalidPageIndexError extends Error {
    constructor() {
        super("page index must be greater or equals to one");
    }
}