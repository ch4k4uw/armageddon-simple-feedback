import { INanoIdService } from "./nano-id-service";
import { customAlphabet } from 'nanoid';

const customNanoId = (() => {
    let customNanoId: () => string;
    let result = function(): string {
        if (customNanoId == undefined) {
            const nanoIdLen = +(process.env.ARMAGEDDON_NANOID_LEN as string) || 16;
            customNanoId = customAlphabet('ABCDEFGHIJKLMNOPQRSUVWXYZabcdefghijklmnopqrsuvwxyz0123456789', nanoIdLen);
        }
        return customNanoId();
    };
    return result;
})();

export class NanoIdServiceImpl implements INanoIdService {
    constructor() { }
    async createId(): Promise<string> {
        return customNanoId();
    }
}