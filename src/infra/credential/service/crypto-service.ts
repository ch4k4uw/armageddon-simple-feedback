export interface ICryptoService {
    hash(plain: string): Promise<string>;
    compare(plain: string, text: string): Promise<boolean>;
    encrypt(psw: string, plain: string): Promise<string>;
    decrypt(psw: string, data: string): Promise<string>;
}