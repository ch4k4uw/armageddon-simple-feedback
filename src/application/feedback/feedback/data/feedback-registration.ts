export class FeedbackRegistration {
    constructor(
        public readonly topic: string,
        public readonly rating: number,
        public readonly reason?: string,
    ) { }
}