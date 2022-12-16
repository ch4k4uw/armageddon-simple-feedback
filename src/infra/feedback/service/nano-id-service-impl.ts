import { INanoIdService } from "./nano-id-service";
import * as Nanoid from 'nanoid';

const NanoIdLen = +(process.env.ARMAGEDDON_NANOID_LEN as string) || 16;
const customNanoid = Nanoid.customAlphabet('ABCDEFGHIJKLMNOPQRSUVWXYZabcdefghijklmnopqrsuvwxyz0123456789', NanoIdLen);

export class NanoIdServiceImpl implements INanoIdService {
    async createId(): Promise<string> {
        return customNanoid();
    }
}