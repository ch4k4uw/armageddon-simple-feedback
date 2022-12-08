export class User {
    constructor(
        public readonly id: string = "",
        public readonly firstName: string = "",
        public readonly lastName: string = "",
        public readonly email: string = "",
    ) { }
    static readonly empty = new User();
}