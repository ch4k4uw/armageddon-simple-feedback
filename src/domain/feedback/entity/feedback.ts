export class Feedback {
    constructor(
        public id: string = "",
        public topic: string = "",
        public rating: number = 0,
        public reason: string = "",
    ) { }
}