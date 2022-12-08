export class RawJwToken {
    constructor(
        public readonly accessToken: string = "",
        public readonly refreshToken: string = "",
    ) { }

    static readonly empty = new RawJwToken();

    get isAccessToken(): boolean {
        return this.accessToken !== "";
    }

    get isRefreshToken(): boolean {
        return this.refreshToken !== "";
    }
}