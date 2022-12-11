export class Feedback {
    constructor(
        public readonly id: string = "",
        public readonly topic: string = "",
        public readonly rating: number = 0,
        public readonly reason: string = "",
    ) { }

    static readonly empty = new Feedback();
}