import { IJwTokenService } from "./jw-token-service";
import { JwAccessTokenPayloadModel } from "./model/jw-access-token-payload-model";
import { JwRefreshTokenPayloadModel } from "./model/jw-refresh-token-payload-model";
import Jwt from "jsonwebtoken";
import { IJwTokenKeyProvider } from "./jw-token-key-provider";
import { InvalidRefreshTokenError } from "../../../domain/token/data/invalid-refresh-token-error";
import { InvalidAccessTokenError } from "../../../domain/token/data/invalid-access-token-error";
import { LoggedUser } from "../../../domain/common/entity/logged-user";
import { ExpiredRefreshTokenError } from "../../../domain/token/data/expired-refresh-token-error";
import { ExpiredAccessTokenError } from "../../../domain/token/data/expired-access-token-error";

export class JwTokenServiceImpl implements IJwTokenService {
    constructor(private keyProvider: IJwTokenKeyProvider) { }

    createAccessToken(payload: JwAccessTokenPayloadModel): Promise<string> {
        return new Promise((resolve, reject) => {
            this.tryBlock(() => {
                Jwt.sign(
                    Object.assign({}, payload),
                    this.keyProvider.accessToken,
                    {
                        algorithm: this.keyProvider.accessTokenAlgorithm,
                        expiresIn: this.keyProvider.accessTokenExpiration,
                    },
                    (err, encoded) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(encoded || "");
                        }
                    }
                );
            }, reject);
        });
    }

    private tryBlock(block: () => void, reject: (reason?: any) => void) {
        try {
            block();
        } catch (e) {
            reject(e);
        }
    }

    createRefreshToken(payload: JwRefreshTokenPayloadModel): Promise<string> {
        return new Promise((resolve, reject) => {
            this.tryBlock(() => {
                Jwt.sign(
                    Object.assign({}, payload),
                    this.keyProvider.refreshToken,
                    {
                        algorithm: this.keyProvider.refreshTokenAlgorithm,
                        expiresIn: this.keyProvider.refreshTokenExpiration,
                    },
                    (err, encoded) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(encoded || "");
                        }
                    }
                );
            }, reject);
        });
    }

    verifyAccessToken(raw: string): Promise<JwAccessTokenPayloadModel> {
        return new Promise((resolve, reject) => {
            this.tryBlock(() => {
                Jwt.verify(
                    raw,
                    this.keyProvider.accessToken,
                    {
                        algorithms: [this.keyProvider.accessTokenAlgorithm],
                    },
                    (err, payload) => {
                        if (err) {
                            if (err instanceof Jwt.TokenExpiredError) {
                                reject(new ExpiredAccessTokenError(undefined, err));
                            } else {
                                reject(new InvalidAccessTokenError(undefined, err));
                            }
                        } else {
                            const rawPayload = payload as JwAccessTokenPayloadModel;
                            resolve(
                                new JwAccessTokenPayloadModel(
                                    new LoggedUser(
                                        rawPayload.loggedUser.id,
                                        rawPayload.loggedUser.name,
                                        rawPayload.loggedUser.roles,
                                    )
                                )
                            );
                        }
                    }
                );
            }, reject);
        });
    }

    verifyRefreshToken(raw: string): Promise<JwRefreshTokenPayloadModel> {
        return new Promise((resolve, reject) => {
            this.tryBlock(() => {
                Jwt.verify(
                    raw,
                    this.keyProvider.refreshToken,
                    { algorithms: [this.keyProvider.refreshTokenAlgorithm] },
                    (err, payload) => {
                        if (err) {
                            if (err instanceof Jwt.TokenExpiredError) {
                                reject(new ExpiredRefreshTokenError(undefined, err));
                            } else {
                                reject(new InvalidRefreshTokenError(undefined, err));
                            }
                        } else {
                            const rawPayload = payload as JwRefreshTokenPayloadModel;
                            resolve(
                                new JwRefreshTokenPayloadModel(
                                    rawPayload.id,
                                    new LoggedUser(
                                        rawPayload.loggedUser.id,
                                        rawPayload.loggedUser.name,
                                        rawPayload.loggedUser.roles,
                                    )
                                )
                            );
                        }
                    }
                );
            }, reject);
        });
    }

}