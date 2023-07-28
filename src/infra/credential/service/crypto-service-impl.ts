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

    async encrypt(psw: string, plain: string): Promise<string> {
        const salt = Crypto.randomBytes(this.config.randomBytesSize);
        const key = await this.deriveKey(psw, salt);
        const iv = Buffer.alloc(this.config.randomBytesSize, 0);
        const cipher = Crypto.createCipheriv(this.config.symmCiphAlgorithm, key, iv);

        return new Promise((resolve, reject) => {
            let result: Buffer | null = null;
            try {
                cipher.on("readable", () => {
                    let chunk;
                    while (null !== (chunk = cipher.read())) {
                        if (result == null) {
                            result = chunk;
                        } else {
                            result = Buffer.concat([result, chunk]);
                        }
                    }
                });
                cipher.on("end", () => {
                    if (result != null) {
                        const saltHeader = this.createLenHeader(salt.length);
                        const resultHeader = this.createLenHeader(result.length);
                        resolve(Buffer.concat([saltHeader, resultHeader, salt, result]).toString('base64'));
                    } else {
                        reject(new Error("invalid state (result is null)"));
                    }
                });
                cipher.on("error", (e) => {
                    reject(e);
                });
                cipher.write(plain);
                cipher.end();
            } catch (e) {
                reject(e);
            }
        });
    }

    async decrypt(psw: string, data: string): Promise<string> {
        const source = Buffer.from(data, 'base64');
        const saltLen = this.readLenHeader(source, 0);
        const dataLen = this.readLenHeader(source, 3);
        const salt = source.subarray(6, 6 + saltLen);

        const rawData = source.subarray(6 + saltLen, 6 + saltLen + dataLen);
        const key = await this.deriveKey(psw, salt);
        const iv = Buffer.alloc(this.config.randomBytesSize, 0);
        const cipher = Crypto.createDecipheriv(this.config.symmCiphAlgorithm, key, iv);

        return new Promise((resolve, reject) => {
            let result = "";
            try {
                cipher.on("readable", () => {
                    let chunk;
                    while (null !== (chunk = cipher.read())) {
                        result += chunk;
                    }
                });
                cipher.on("end", () => {
                    resolve(result);
                });
                cipher.on("error", (e) => {
                    reject(e);
                });
                cipher.write(rawData);
                cipher.end();
            } catch (e) {
                reject(e);
            }
        });
    }

}