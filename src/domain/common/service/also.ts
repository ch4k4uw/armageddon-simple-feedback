export function also<T>(obj: T, applyBlock: (obj: T) => void): T {
    applyBlock(obj)
    return obj;
}