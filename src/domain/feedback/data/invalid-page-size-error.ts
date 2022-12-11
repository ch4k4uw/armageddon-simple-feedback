export class InvalidPageSizeError extends Error {
    constructor() {
        super("page size must be greater or equals to one");
    }
}