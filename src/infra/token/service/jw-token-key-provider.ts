import Jwt from "jsonwebtoken";

export interface IJwTokenKeyProvider {
    readonly accessToken: string;
    readonly refreshToken: string;
    readonly accessTokenAlgorithm: Jwt.Algorithm;
    readonly refreshTokenAlgorithm: Jwt.Algorithm;
    readonly accessTokenExpiration: string;
    readonly refreshTokenExpiration: string;
}