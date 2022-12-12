export interface IJwTokenKeyProvider {
    readonly accessToken: string;
    readonly refreshToken: string;
    readonly algorithm: string;
}