import { ICryptoConfigProvider } from "./crypto-config-provider";

export class CryptoConfigProviderImpl implements ICryptoConfigProvider {
    get randomBytesSize(): number {
        return +(process.env.ARMAGEDDON_RND_BYTES_SZ as string) || this.throwNotDefined(
            "ARMAGEDDON_RND_BYTES_SZ"
        );
    }

    private throwNotDefined(name: string): any {
        throw new Error(`${name} must be defined`);
    }

    get derivedKeyLength(): number {
        return +(process.env.ARMAGEDDON_DERIVED_KEY_LEN as string) || this.throwNotDefined(
            "ARMAGEDDON_DERIVED_KEY_LEN"
        );
    }

}