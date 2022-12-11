export class RatingOutOfRangeError extends Error {
    constructor() {
        super("invalid rating range value");
    }
}