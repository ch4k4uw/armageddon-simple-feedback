export class ReasonLengthOverflow extends Error {
    constructor() {
        super("reason length exceeded");
    }
}