export class FeedbackQuery {
    constructor(
        public query?: string,
        public size: number = 10,
        public index: number = 1
    ) { }
}