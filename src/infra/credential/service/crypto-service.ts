export interface ICryptoService {
    hash(plain: string): Promise<string>;
    compare(plain: string, text: string): Promise<boolean>;
}