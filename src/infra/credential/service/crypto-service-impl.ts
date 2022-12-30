import * as Crypto from "crypto";
import { Inject } from "typedi";
import { IoCId } from "../../../ioc/ioc-id";
import { ICryptoConfigProvider } from "./crypto-config-provider";
import { ICryptoService } from "./crypto-service";

const cost = 16384;
const blockSize = 8;
const parallelization = 1;

export class CryptoServiceImpl implements ICryptoService {
    constructor(@Inject(IoCId.Infra.CRYPTO_CONFIG_PROVIDER) private config: ICryptoConfigProvider) { }

    async hash(plain: string): Promise<string> {
        const salt = Crypto.randomBytes(this.config.randomBytesSize);
        const hash = await this.deriveKey(plain, salt);
        const saltHeader = this.createLenHeader(salt.length);
        const derivedKeyHeader = this.createLenHeader(hash.length);
        return Buffer.concat([saltHeader, derivedKeyHeader, salt, hash]).toString('base64');
    }

    private deriveKey(key: string, salt: Buffer): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            Crypto.scrypt(
                key,
                salt,
                this.config.derivedKeyLength,
                { N: cost, r: blockSize, p: parallelization },
                (err, derivedKey) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(derivedKey);
                    }
                }
            );
        });
    }

    private createLenHeader(len: number): Buffer {
        const header = Buffer.alloc(3, 0);
        header.writeUInt8((len & 0xFF0000) >> 16, 0);
        header.writeUInt8((len & 0xFF00) >> 8, 1);
        header.writeUInt8((len & 0xFF) >> 0, 2);
        return header;
    }

    async compare(plain: string, text: string): Promise<boolean> {
        const rawHash = Buffer.from(text, 'base64');
        const saltLen = this.readLenHeader(rawHash, 0);
        const hashLen = this.readLenHeader(rawHash, 3);
        const salt = rawHash.subarray(6, 6 + saltLen);
        const hash1 = rawHash.subarray(6 + saltLen, 6 + saltLen + hashLen);
        const hash2 = await this.deriveKey(plain, salt);
        return hash1.compare(hash2) === 0;
    }

    private readLenHeader(data: Buffer, offset: number): number {
        return (data.readUInt8(offset) << 16) |
            (data.readUInt8(offset + 1) << 8) |
            (data.readUInt8(offset + 2) << 0);
    }

}