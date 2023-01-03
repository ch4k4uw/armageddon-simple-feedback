interface ILazy {
    <T>(creator: () => T): { value: T };
}

export const lazy: ILazy = ((creator: () => any) => {
    return (() => {
        let value: any;
        let fn: any = function () {
            if (value == undefined) {
                value = creator();
            }
            return value;
        }
        return {
            get value() {
                return fn();
            }
        }
    })();
});