export interface ICryptoConfigProvider {
    readonly randomBytesSize: number;
    readonly derivedKeyLength: number;
}