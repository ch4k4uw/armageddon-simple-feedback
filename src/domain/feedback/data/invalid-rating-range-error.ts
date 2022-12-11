export class InvalidRatingRangeError extends Error {
    constructor() {
        super("invalid rating range value");
    }
}