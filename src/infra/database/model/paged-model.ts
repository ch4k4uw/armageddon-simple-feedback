export class PagedModel<T> {
    constructor(
        readonly result: T[],
        readonly size: number,
        readonly index: number,
        readonly total: number,
    ) { }
}