export function reject(name: string, fn: () => Promise<any>, postValidation?: (err: any) => void) {
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