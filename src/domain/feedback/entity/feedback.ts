export class Feedback {
    constructor(
        public readonly id: string = "",
        public readonly topic: string = "",
        public readonly rating: number = 0,
        public readonly reason: string = "",
        public readonly created: number = 0,
    ) { }

    static readonly empty = new Feedback();
}