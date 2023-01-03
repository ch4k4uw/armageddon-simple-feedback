import { Express, NextFunction, Request, RequestHandler, Response, Router } from "express";
import * as Joi from "joi";
import { Service } from "typedi";
import { FindAccessTokenApp } from "../../application/token/find-access-token-app";
import { FindRefreshTokenApp } from "../../application/token/find-refresh-token-app";
import { InvalidUserOrPasswordError } from "../../domain/credential/data/invalid-login-or-password-error";
import { ExpiredAccessTokenError } from "../../domain/token/data/expired-access-token-error";
import { ExpiredRefreshTokenError } from "../../domain/token/data/expired-refresh-token-error";
import { InvalidAccessTokenError } from "../../domain/token/data/invalid-access-token-error";
import { InvalidRefreshTokenError } from "../../domain/token/data/invalid-refresh-token-error";
import { RawJwToken } from "../../domain/token/data/raw-jw-token";
import { JwToken } from "../../domain/token/entity/jw-token";
import { IReqAuth, IReqToken } from "./common/req-auth";
import { Logger } from "./common/service/logger";
import { RequestAuthHeaderParser } from "./common/service/request-auth-header-parser";
import { RefreshTokenHandler } from "./handler/refresh-token-.handler";
import { RemoveTokenHandler } from "./handler/remove-token.handler";
import { RequestHandlerBuilder } from "./handler/request-handler-builder";
import { RequestLoggedUserHandler } from "./handler/request-logged-user.handler";
import { RequestTokenHandler } from "./handler/request-token.handler";
import { AuthorizationHeaderValidator } from "./validator/authorization-header.validator";
import { RequestTokenBodyValidator } from "./validator/request-token-body.validator";
import { ValidatorBuilder } from "./validator/validator-builder";

const apiRoutes = {
    requestToken: '/api/v1/token',
    refreshToken: '/api/v1/token',
    revokeToken: '/api/v1/token',

    getMe: '/api/v1/me',
}

@Service()
export class ApiRoute {
    private router: Router;
    constructor(
        private logger: Logger,
        private requestAuthHeaderParser: RequestAuthHeaderParser,
        private findAccessTokenSvc: FindAccessTokenApp,
        private findRefreshTokenSvc: FindRefreshTokenApp,

        private validatorBuilder: ValidatorBuilder,
        private requestTokenValidtor: RequestTokenBodyValidator,
        private authorizationHeaderValidator: AuthorizationHeaderValidator,

        private requestHandlerBuilder: RequestHandlerBuilder,
        private requestTokenHandler: RequestTokenHandler,
        private requestLoggedUserHandler: RequestLoggedUserHandler,
        private refreshTokenHandler: RefreshTokenHandler,
        private removeTokenHandler: RemoveTokenHandler,
    ) {
        this.router = Router();
        this.setupLogger();
        this.setupRouter();
        this.setupErrorHandler();
    }

    private setupLogger() {
        this.router.use(async (req, _res, next) => {
            this.logger.logInfo(`${req.method} ${req.path}`);
            next();
        });
    }

    private setupRouter() {
        this.setupSignInRoute();
        this.setupFindLoggedUserRoute();
        this.setupRefreshTokenRoute();
        this.setupRemoveRefreshTokenRoute();
    }

    private setupSignInRoute() {
        const route = apiRoutes.requestToken;
        this.router.post(
            route,
            this.validatorBuilder.build(this.requestTokenValidtor),
            this.requestHandlerBuilder.build(this.requestTokenHandler),
        );
        this.logger.logDebug(`Route "POST: ${route}" registered`);
    }

    private setupFindLoggedUserRoute() {
        const route = apiRoutes.getMe;
        this.router.get(
            route,
            this.validatorBuilder.build(this.authorizationHeaderValidator),
            this.findTokenMiddleware,
            this.findAccessTokenMiddleware,
            this.requestHandlerBuilder.build(this.requestLoggedUserHandler),
        );
        this.logger.logDebug(`Route "GET: ${route}" registered`);
    }

    private get findTokenMiddleware(): RequestHandler {
        return this.asCatched((req, _res, next) => {
            const token = this.requestAuthHeaderParser.parse(req);
            const resume = req as IReqAuth;
            resume.token = {
                raw: this.assertToken(token),
                token: new JwToken()
            }
            next();
        });
    }

    private assertToken(token: string | undefined): string {
        if (!token) {
            throw new Error();
        }
        return token;
    }

    private asCatched<P, ResBody, ReqBody, ReqQuery, Locals>(
        handler: RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>
    ): RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> {
        return async (req, res, next) => {
            try {
                await handler(req, res, next);
            } catch (e) {
                next(e);
            }
        }
    }

    private get findAccessTokenMiddleware(): RequestHandler {
        return this.asCatched(async (req, _res, next) => {
            await this.findJwTokenMiddleware(req, async (raw) => {
                return await this.findAccessTokenSvc.find(
                    new RawJwToken(raw)
                );
            });
            next();
        });
    }

    private async findJwTokenMiddleware(
        req: Request, appFn: (rawToken: string | undefined) => Promise<JwToken>
    ) {
        const authReq = req as IReqAuth;
        const jwToken = await appFn(authReq.token?.raw);
        const token = this.assertIToken(authReq.token);
        token.token = jwToken;
    }

    private assertIToken(token: IReqToken | undefined): IReqToken {
        if (!token) {
            throw new Error();
        }
        return token;
    }

    private setupRefreshTokenRoute() {
        const route = apiRoutes.refreshToken;
        this.router.put(
            route,
            this.validatorBuilder.build(this.authorizationHeaderValidator),
            this.findTokenMiddleware,
            this.findRefreshTokenMiddleware,
            this.requestHandlerBuilder.build(this.refreshTokenHandler),
        );
        this.logger.logDebug(`Route "PUT: ${route}" registered`);
    }

    private get findRefreshTokenMiddleware(): RequestHandler {
        return this.asCatched(async (req, _res, next) => {
            await this.findJwTokenMiddleware(req, async (raw) => {
                return await this.findRefreshTokenSvc.find(
                    new RawJwToken(undefined, raw)
                );
            });
            next();
        });
    }

    private setupRemoveRefreshTokenRoute() {
        const route = apiRoutes.revokeToken;
        this.router.delete(
            route,
            this.validatorBuilder.build(this.authorizationHeaderValidator),
            this.findTokenMiddleware,
            this.findRefreshTokenMiddleware,
            this.requestHandlerBuilder.build(this.removeTokenHandler),
        );
        this.logger.logDebug(`Route "DELETE: ${route}" registered`);
    }

    private setupErrorHandler() {
        this.router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            const joiError = err as Joi.ValidationError;
            if (joiError.isJoi) {
                this.logger.logDebug("Joi error");
                this.logger.logDebug(joiError.stack || "");
                res.status(400).send({ message: joiError.details.map(d => d.message).join(', ') });
            } else {
                let message: string | undefined;
                let errorCode = 500;
                if (err instanceof InvalidUserOrPasswordError) {
                    message = err.message;
                    errorCode = 401;
                } else if (
                    err instanceof InvalidAccessTokenError ||
                    err instanceof InvalidRefreshTokenError ||
                    err instanceof ExpiredAccessTokenError ||
                    err instanceof ExpiredRefreshTokenError) {
                    message = err.message;
                    errorCode = 401;
                }

                if (message) {
                    this.logger.logDebug(`${errorCode} error`);
                    this.logger.logDebug("Header");
                    this.logger.logDebug(req.headers);
                    this.logger.logDebug("Body");
                    this.logger.logDebug(req.body);
                    this.logger.logDebug("");
                    res.status(errorCode).send({ message });
                } else {
                    next(err);
                }
            }
        });

    }

    setupExpressApp(app: Express) {
        app.use(this.router);
    }
}