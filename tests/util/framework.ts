interface Reject {
    (name: string, fn: () => Promise<any>, postValidation?: (err: any) => void): void;
    skip: Reject;
}

export const reject: Reject = (() => {
    var _t: any = function(name: string, fn: () => Promise<any>, postValidation?: (err: any) => void) {
        test(name, (done) => {
            fn()
                .then((_) => done('should be rejected'))
                .catch((err) => {
                    try {
                        if (postValidation) {
                            postValidation(err);
                        }
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                });
        });
    }
    _t.skip = function(name: string, _fn: () => Promise<any>, _postValidation?: (err: any) => void) {
        test.skip(name, () => {});
    }
    return _t;
})();

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