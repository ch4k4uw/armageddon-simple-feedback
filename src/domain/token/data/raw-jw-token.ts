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

    cloneWith(accessToken?: string, refreshToken?: string) {
        return new RawJwToken(
            accessToken || this.accessToken, refreshToken || this.refreshToken
        );
    }
}