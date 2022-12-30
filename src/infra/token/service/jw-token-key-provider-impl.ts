import Jwt from "jsonwebtoken";
import { IJwTokenKeyProvider } from "./jw-token-key-provider";

export class JwTokenKeyProviderImpl implements IJwTokenKeyProvider {
    get accessToken(): string {
        return process.env.ARMAGEDDON_ACCESS_TOKEN_SECRET || this.throwNotDefined(
            "ARMAGEDDON_ACCESS_TOKEN_SECRET"
        );
    }

    private throwNotDefined(name: string): any {
        throw new Error(`${name} must be defined`);
    }

    get refreshToken(): string {
        return process.env.ARMAGEDDON_REFRESH_TOKEN_SECRET || this.throwNotDefined(
            "ARMAGEDDON_REFRESH_TOKEN_SECRET"
        );
    }

    get accessTokenAlgorithm(): Jwt.Algorithm {
        return process.env.ARMAGEDDON_ACCESS_TOKEN_ALGORITHM || this.throwNotDefined(
            "ARMAGEDDON_ACCESS_TOKEN_ALGORITHM"
        );
    }

    get refreshTokenAlgorithm(): Jwt.Algorithm {
        return process.env.ARMAGEDDON_REFRESH_TOKEN_ALGORITHM || this.throwNotDefined(
            "ARMAGEDDON_REFRESH_TOKEN_ALGORITHM"
        );
    }

    get accessTokenExpiration(): string {
        return process.env.ARMAGEDDON_ACCESS_TOKEN_EXPIRATION || this.throwNotDefined(
            "ARMAGEDDON_ACCESS_TOKEN_EXPIRATION"
        );
    }

    get refreshTokenExpiration(): string {
        return process.env.ARMAGEDDON_REFRESH_TOKEN_EXPIRATION || this.throwNotDefined(
            "ARMAGEDDON_REFRESH_TOKEN_EXPIRATION"
        );
    }

}