import { Express, NextFunction, Request, RequestHandler, Response, Router } from "express";
import * as Joi from "joi";
import { Service } from "typedi";
import { FindAccessTokenApp } from "../../application/token/find-access-token-app";
import { FindRefreshTokenApp } from "../../application/token/find-refresh-token-app";
import { InvalidUserOrPasswordError } from "../../domain/credential/data/invalid-login-or-password-error";
import { ExpiredTopicError } from "../../domain/feedback/data/expired-topic-error";
import { TopicDuplicationError } from "../../domain/feedback/data/topic-duplication-error";
import { TopicNotFoundError } from "../../domain/feedback/data/topic-not-found-error";
import { ExpiredAccessTokenError } from "../../domain/token/data/expired-access-token-error";
import { ExpiredRefreshTokenError } from "../../domain/token/data/expired-refresh-token-error";
import { InvalidAccessTokenError } from "../../domain/token/data/invalid-access-token-error";
import { InvalidRefreshTokenError } from "../../domain/token/data/invalid-refresh-token-error";
import { RawJwToken } from "../../domain/token/data/raw-jw-token";
import { JwToken } from "../../domain/token/entity/jw-token";
import { IAuthRequest } from "./common/req-auth";
import { Logger } from "./common/service/logger";
import { RequestAuthHeaderParser } from "./common/service/request-auth-header-parser";
import { RefreshTokenHandler } from "./handler/refresh-token-.handler";
import { RegisterTopicHandler } from "./handler/register-topic.handler";
import { RemoveTokenHandler } from "./handler/remove-token.handler";
import { RemoveTopicHandler } from "./handler/remove-topic.handler";
import { RequestHandlerBuilder } from "./handler/request-handler-builder";
import { RequestLoggedUserHandler } from "./handler/request-logged-user.handler";
import { RequestTokenHandler } from "./handler/request-token.handler";
import { RequestTopicPageHandler } from "./handler/request-topic-page.handler";
import { AuthorizationHeaderValidator } from "./validator/authorization-header.validator";
import { RegisterOrUpdateTopicBodyValidator } from "./validator/register-or-update-topic-body.validator";
import { RequestTopicByIdParamValidator } from "./validator/request-topic-by-id-param.validator";
import { RequestTokenBodyValidator } from "./validator/request-token-body.validator";
import { RequestPageHeaderValidator } from "./validator/request-page-header.validator";
import { ValidatorBuilder } from "./validator/validator-builder";
import { RequestTopicByCodeParamValidator } from "./validator/request-topic-by-code-param.validator";
import { RequestTopicByIdHandler } from "./handler/request-topic-by-id.handler";
import { RequestTopicByCodeHandler } from "./handler/request-topic-by-code.handler";
import { UpdateTopicHandler } from "./handler/update-topic.handler";
import { RegisterFeedbackBodyValidator } from "./validator/register-feedback-body.validator";
import { RegisterOrRequestFeedbackPageParamValidator } from "./validator/register-or-request-feedback-page-param.validator";
import { RequestFeedbackPageHandler } from "./handler/request-feedback-page.handler";
import { RegisterFeedbackHandler } from "./handler/register-feedback.handler";
import { RequestFeedbackByIdHandler } from "./handler/request-feedback-by-id.handler";
import { RequestFeedbackByIdParamValidator } from "./validator/request-feedback-by-id-param.validator";
import { RequestTopicSummaryByIdHandler } from "./handler/request-topic-summary-by-id.handler";
import { FeedbackNotFoundError } from "../../domain/feedback/data/feedback-not-found-error";
import { InvalidPageIndexError } from "../../domain/feedback/data/invalid-page-index-error";
import { InvalidPageSizeError } from "../../domain/feedback/data/invalid-page-size-error";
import { RatingOutOfRangeError } from "../../domain/feedback/data/rating-out-of-range-error";
import { ReasonLengthOverflow } from "../../domain/feedback/data/reason-length-overflow-error";
import { UserPrivilegeError } from "../../domain/common/data/user-privilege-error";
import { PingHandler } from "./handler/ping.handler";
import { RequestTopicByTopicIdMetadataHandler } from "./handler/request-topic-by-topic-id-metadata.handler";
import { RequestTopicIdMetadataByTopicCodeHandler } from "./handler/request-topic-id-metadata-by-topic-code.handler";
import { RequestTopicByTopicIdMetadataParamValidator } from "./validator/request-topic-by-topic-id-metadata-param.validator";
import { RequestTopicIdMetadataByTopicCodeParamValidator } from "./validator/request-topic-id-metadata-by-topic-code-param.validator";

const apiRoutes = {
    requestPing: '/api/v1/ping',

    requestToken: '/api/v1/token',
    refreshToken: '/api/v1/token',
    revokeToken: '/api/v1/token',

    getMe: '/api/v1/me',

    requestTopicPage: '/api/v1/topic/page',
    registerTopic: '/api/v1/topic',
    removeTopic: '/api/v1/topic/:id',
    requestTopicById: '/api/v1/topic/:id',
    requestTopicByCode:'/api/v1/topic/code-attr/:code',
    updateTopicById: '/api/v1/topic/:id',
    requestTopicSummaryById: '/api/v1/topic/:id/summary',
    
    requestTopicByTopicIdMetadata: '/api/v1/topic-id-metadata/:id',
    requestTopicIdMetadataByTopicCode: '/api/v1/topic-id-metadata/topic/:code',

    requestFeedbackPage: '/api/v1/topic/:topic/feedback',
    registerFeedback: '/api/v1/topic/:topic/feedback',
    requestFeedbackById: '/api/v1/topic/feedback/:id',
}

@Service()
export class ApiRoute {
    private router: Router;
    constructor(
        private logger: Logger,

        private pingHandler: PingHandler,

        private requestAuthHeaderParser: RequestAuthHeaderParser,
        private findAccessTokenSvc: FindAccessTokenApp,
        private findRefreshTokenSvc: FindRefreshTokenApp,

        private validatorBuilder: ValidatorBuilder,
        private requestTokenValidtor: RequestTokenBodyValidator,
        private authorizationHeaderValidator: AuthorizationHeaderValidator,
        private requestPageHeaderValidator: RequestPageHeaderValidator,
        private registerOrUpdateTopicBodyValidator: RegisterOrUpdateTopicBodyValidator,
        private requestTopicByIdParamValidator: RequestTopicByIdParamValidator,
        private requestTopicByCodeParamValidator: RequestTopicByCodeParamValidator,
        private registerFeedbackBodyValidator: RegisterFeedbackBodyValidator,
        private registerOrRequestFeedbackPageParamValidator: RegisterOrRequestFeedbackPageParamValidator,
        private requestFeedbackByIdParamValidator: RequestFeedbackByIdParamValidator,
        private requestTopicByTopicIdMetadataParamValidator: RequestTopicByTopicIdMetadataParamValidator,
        private requestTopicIdMetadataByTopicCodeParamValidator: RequestTopicIdMetadataByTopicCodeParamValidator,

        private requestHandlerBuilder: RequestHandlerBuilder,
        private requestTokenHandler: RequestTokenHandler,
        private requestLoggedUserHandler: RequestLoggedUserHandler,
        private refreshTokenHandler: RefreshTokenHandler,
        private removeTokenHandler: RemoveTokenHandler,
        private requestTopicPageHandler: RequestTopicPageHandler,
        private registerTopicHandler: RegisterTopicHandler,
        private removeTopicHandler: RemoveTopicHandler,
        private requestTopicByIdHandler: RequestTopicByIdHandler,
        private requestTopicByCodeHandler: RequestTopicByCodeHandler,
        private updateTopicHandler: UpdateTopicHandler,
        private requestTopicSummaryByIdHandler: RequestTopicSummaryByIdHandler,
        private requestFeedbackPageHandler: RequestFeedbackPageHandler,
        private registerFeedbackHandler: RegisterFeedbackHandler,
        private requestFeedbackByIdHandler: RequestFeedbackByIdHandler,
        private requestTopicByTopicIdMetadataHandler: RequestTopicByTopicIdMetadataHandler,
        private requestTopicIdMetadataByTopicCodeHandler: RequestTopicIdMetadataByTopicCodeHandler,
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
        this.setupPingRoute();
        this.setupSignInRoute();
        this.setupFindLoggedUserRoute();
        this.setupRefreshTokenRoute();
        this.setupRemoveRefreshTokenRoute();
        this.setupRequestTopicPageRoute();
        this.setupRegisterTopicRoute();
        this.setupRemoveTopicRoute();
        this.setupRequestTopicByIdRoute();
        this.setupRequestTopicByCodeRoute();
        this.setupUpdateTopicRoute();
        this.setupRequestTopicSummaryByIdRoute();
        this.setupRequestFeedbackPageRoute();
        this.setupRegisterFeedbackRoute();
        this.setupRequestFeedbackByIdRoute();
        this.setupRequestTopicByTopicIdMetadataRoute();
        this.setupRequestTopicIdMetadataByTopicCode();
    }

    private setupPingRoute() {
        this.setupGetRoute(
            apiRoutes.requestPing,
            this.requestHandlerBuilder.build(this.pingHandler),
        );
    }

    private setupGetRoute(route: string, ...handlers: RequestHandler[]) {
        const fn: Function = this.router.get;
        fn.apply(this.router, [route, ...handlers]);
        this.logger.logDebug(`Route "GET: ${route}" registered`);
    }

    private setupSignInRoute() {
        this.setupPostRoute(
            apiRoutes.requestToken,
            this.validatorBuilder.build(this.requestTokenValidtor),
            this.requestHandlerBuilder.build(this.requestTokenHandler),
        );
    }

    private setupPostRoute(route: string, ...handlers: RequestHandler[]) {
        const fn: Function = this.router.post;
        fn.apply(this.router, [route, ...handlers]);
        this.logger.logDebug(`Route "POST: ${route}" registered`);
    }

    private setupFindLoggedUserRoute() {
        this.setupGetRoute(
            apiRoutes.getMe,
            this.validatorBuilder.build(this.authorizationHeaderValidator),
            this.findTokenMiddleware,
            this.findAccessTokenMiddleware,
            this.requestHandlerBuilder.build(this.requestLoggedUserHandler),
        );
    }

    private get findTokenMiddleware(): RequestHandler {
        return this.asCatched((req, _res, next) => {
            const token = this.requestAuthHeaderParser.parse(req);
            const resume = req as IAuthRequest;
            resume.auth = {
                rawToken: this.assertToken(token),
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

    private asCatched(handler: RequestHandler): RequestHandler {
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
        req: IAuthRequest | Request, appFn: (rawToken: string | undefined) => Promise<JwToken>
    ) {
        const authReq = req as IAuthRequest;
        if (!authReq.auth) {
            throw new Error("missing 'auth' field");
        }
        const jwToken = await appFn(authReq.auth.rawToken);
        authReq.auth.token = jwToken;
    }

    private setupRefreshTokenRoute() {
        this.setupPutRoute(
            apiRoutes.refreshToken,
            this.validatorBuilder.build(this.authorizationHeaderValidator),
            this.findTokenMiddleware,
            this.findRefreshTokenMiddleware,
            this.requestHandlerBuilder.build(this.refreshTokenHandler),
        );
    }

    private setupPutRoute(route: string, ...handlers: RequestHandler[]) {
        const fn: Function = this.router.put;
        fn.apply(this.router, [route, ...handlers]);
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
        this.setupDeleteRoute(
            apiRoutes.revokeToken,
            this.validatorBuilder.build(this.authorizationHeaderValidator),
            this.findTokenMiddleware,
            this.findRefreshTokenMiddleware,
            this.requestHandlerBuilder.build(this.removeTokenHandler),
        );
    }

    private setupDeleteRoute(route: string, ...handlers: RequestHandler[]) {
        const fn: Function = this.router.delete;
        fn.apply(this.router, [route, ...handlers]);
        this.logger.logDebug(`Route "DELETE: ${route}" registered`);
    }

    private setupRequestTopicPageRoute() {
        this.setupGetRoute(
            apiRoutes.requestTopicPage,
            this.validatorBuilder.build(this.authorizationHeaderValidator),
            this.validatorBuilder.build(this.requestPageHeaderValidator),
            this.findTokenMiddleware,
            this.findAccessTokenMiddleware,
            this.requestHandlerBuilder.build(this.requestTopicPageHandler),
        );
    }

    private setupRegisterTopicRoute() {
        this.setupPostRoute(
            apiRoutes.registerTopic,
            this.validatorBuilder.build(this.authorizationHeaderValidator),
            this.validatorBuilder.build(this.registerOrUpdateTopicBodyValidator),
            this.findTokenMiddleware,
            this.findAccessTokenMiddleware,
            this.requestHandlerBuilder.build(this.registerTopicHandler),
        );
    }

    private setupRemoveTopicRoute() {
        this.setupDeleteRoute(
            apiRoutes.removeTopic,
            this.validatorBuilder.build(this.authorizationHeaderValidator),
            this.validatorBuilder.build(this.requestTopicByIdParamValidator),
            this.findTokenMiddleware,
            this.findAccessTokenMiddleware,
            this.requestHandlerBuilder.build(this.removeTopicHandler),
        );
    }

    private setupRequestTopicByIdRoute() {
        this.setupGetRoute(
            apiRoutes.requestTopicById,
            this.validatorBuilder.build(this.authorizationHeaderValidator),
            this.validatorBuilder.build(this.requestTopicByIdParamValidator),
            this.findTokenMiddleware,
            this.findAccessTokenMiddleware,
            this.requestHandlerBuilder.build(this.requestTopicByIdHandler)
        );
    }

    private setupRequestTopicByCodeRoute() {
        this.setupGetRoute(
            apiRoutes.requestTopicByCode,
            this.validatorBuilder.build(this.requestTopicByCodeParamValidator),
            this.requestHandlerBuilder.build(this.requestTopicByCodeHandler)
        );
    }

    private setupUpdateTopicRoute() {
        this.setupPutRoute(
            apiRoutes.updateTopicById,
            this.validatorBuilder.build(this.authorizationHeaderValidator),
            this.validatorBuilder.build(this.registerOrUpdateTopicBodyValidator),
            this.findTokenMiddleware,
            this.findAccessTokenMiddleware,
            this.requestHandlerBuilder.build(this.updateTopicHandler),
        );
    }

    private setupRequestTopicSummaryByIdRoute() {
        this.setupGetRoute(
            apiRoutes.requestTopicSummaryById,
            this.validatorBuilder.build(this.authorizationHeaderValidator),
            this.validatorBuilder.build(this.requestTopicByIdParamValidator),
            this.findTokenMiddleware,
            this.findAccessTokenMiddleware,
            this.requestHandlerBuilder.build(this.requestTopicSummaryByIdHandler),
        );
    }

    private setupRequestFeedbackPageRoute() {
        this.setupGetRoute(
            apiRoutes.requestFeedbackPage,
            this.validatorBuilder.build(this.authorizationHeaderValidator),
            this.validatorBuilder.build(this.registerOrRequestFeedbackPageParamValidator),
            this.validatorBuilder.build(this.requestPageHeaderValidator),
            this.findTokenMiddleware,
            this.findAccessTokenMiddleware,
            this.requestHandlerBuilder.build(this.requestFeedbackPageHandler),
        );
    }

    private setupRegisterFeedbackRoute() {
        this.setupPostRoute(
            apiRoutes.registerFeedback,
            this.validatorBuilder.build(this.registerFeedbackBodyValidator),
            this.requestHandlerBuilder.build(this.registerFeedbackHandler),
        );
    }

    private setupRequestFeedbackByIdRoute() {
        this.setupGetRoute(
            apiRoutes.requestFeedbackById,
            this.validatorBuilder.build(this.authorizationHeaderValidator),
            this.validatorBuilder.build(this.requestFeedbackByIdParamValidator),
            this.findTokenMiddleware,
            this.findAccessTokenMiddleware,
            this.requestHandlerBuilder.build(this.requestFeedbackByIdHandler),
        );
    }

    private setupRequestTopicByTopicIdMetadataRoute() {
        this.setupGetRoute(
            apiRoutes.requestTopicByTopicIdMetadata,
            this.validatorBuilder.build(this.requestTopicByTopicIdMetadataParamValidator),
            this.requestHandlerBuilder.build(this.requestTopicByTopicIdMetadataHandler)
        );
    }

    private setupRequestTopicIdMetadataByTopicCode() {
        this.setupGetRoute(
            apiRoutes.requestTopicIdMetadataByTopicCode,
            this.validatorBuilder.build(this.authorizationHeaderValidator),
            this.validatorBuilder.build(this.requestTopicIdMetadataByTopicCodeParamValidator),
            this.findTokenMiddleware,
            this.findAccessTokenMiddleware,
            this.requestHandlerBuilder.build(this.requestTopicIdMetadataByTopicCodeHandler),
        );
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
                if (
                    err instanceof InvalidUserOrPasswordError ||
                    err instanceof UserPrivilegeError
                ) {
                    message = err.message;
                    errorCode = 403;
                } else if (
                    err instanceof InvalidAccessTokenError ||
                    err instanceof InvalidRefreshTokenError ||
                    err instanceof ExpiredAccessTokenError ||
                    err instanceof ExpiredRefreshTokenError) {
                    message = err.message;
                    errorCode = 401;
                } else if (
                    err instanceof TopicDuplicationError
                ) {
                    message = err.message;
                    errorCode = 409;
                } else if (
                    err instanceof InvalidPageIndexError ||
                    err instanceof InvalidPageSizeError ||
                    err instanceof RatingOutOfRangeError ||
                    err instanceof ReasonLengthOverflow
                ) {
                    message = err.message;
                    errorCode = 400;
                } else if (err instanceof ExpiredTopicError) {
                    message = err.message;
                    errorCode = 410;
                } else if (
                    err instanceof TopicNotFoundError ||
                    err instanceof FeedbackNotFoundError
                ) {
                    message = err.message;
                    errorCode = 404;
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