export class PageView<T> {
    constructor(
        public readonly result: T[],
        public readonly size: number,
        public readonly index: number,
        public readonly total: number,
    ) { }
}