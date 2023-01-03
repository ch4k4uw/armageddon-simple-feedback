import { Service } from "typedi";

@Service()
export class Logger {
    logDebug(message: any) {
        if (typeof message === "object") {
            message = JSON.stringify(message);
        } else if (typeof message != "string") {
            message = message.toString();
        }
        if (process.env.NODE_ENV !== 'production') {
            this.log(90, false, message);
        }
    }

    logError(message: string | Error) {
        this.log(31, true, message);
    }

    logInfo(message: string) {
        this.log(34, false, message);
    }
    
    logWarning(message: string | Error) {
        this.log(93, false, message);
    }

    private log(color: number, asError: boolean, message: string | Error) {
        if (typeof message === 'string') {
            if (asError) {
                console.error(`\x1b[33m${this.now}\x1b[0m \x1b[${color}m${message}\x1b[0m`);
            } else {
                console.log(`\x1b[33m${this.now}\x1b[0m \x1b[${color}m${message}\x1b[0m`);
            }
        } else {
            const error = message as Error;
            const now = this.now;
            if (asError) {
                console.error(`\x1b[33m${now}\x1b[0m \x1b[${color}m${error.message}\x1b[0m`);
                if (error.stack) {
                    console.error(`\x1b[33m${now}\x1b[0m \x1b[${color}m${error.stack}\x1b[0m`);
                }
            } else {
                console.log(`\x1b[33m${now}\x1b[0m \x1b[${color}m${error.message}\x1b[0m`);
            }
        }
    }

    private get now() {
        const now = new Date();
        return `${now.getFullYear()}-` +
            `${padL1(now.getMonth() + 1)}-` +
            `${padL1(now.getDate())}` +
            `'T'${padL1(now.getHours())}:` +
            `${padL1(now.getMinutes())}:` +
            `${padL1(now.getSeconds())}.` +
            `${padLN(now.getMilliseconds(), 3)}`;
    }
}

const padL1 = function(n: number) {
    return n < 10 ? `0${n}` : `${n}`;
}

const padLN = function(n: number, padLen: number) {
    let curr = n | 0;
    let count = curr === 0 ? 1 : 0;
    let result = '';
    while (curr != 0) {
        ++count;
        curr = (curr / 10.0) | 0;
    }
    for (let i=count; i<padLen; ++i) {
        result += '0';
    }
    return `${result}${n}`;
}