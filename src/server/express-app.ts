import { json as jsonBodyParser, urlencoded as urlEncodedBodyParser } from "body-parser";
import express, { Express } from "express";
import * as Http from "http";
import * as Https from "https";
import { Service } from "typedi";
import { ApiRoute } from "./api/api-route";
import { Logger } from "./api/common/service/logger";
import { ServerBinding } from "./server-binding";
import { ServerCert } from "./server-cert";

@Service()
export class ExpressApp {
    private app: Express;
    private server: Http.Server | undefined;

    constructor(
        private logger: Logger,
        private serverCert: ServerCert,
        private serverBinding: ServerBinding,
        private apiRoute: ApiRoute,
    ) { 
        this.app = express();
        this.setupBodyParser();
        this.setupApiRoute();
    }

    private setupBodyParser() {
        this.app.use(jsonBodyParser());
        this.app.use(urlEncodedBodyParser({ extended: true }));
    }

    private setupApiRoute() {
        this.apiRoute.setupExpressApp(this.app);
    }

    listen() {
        this.server = this.isProduction || this.serverBinding.forceHttps ?
            this.createHttpsServer() : this.createHttpServer();

        this.server.listen(this.serverBinding.port, () => {
            this.logger.logInfo(`Listening on ${this.serverBinding.port} port.`);
        });
    }

    private get isProduction() {
        return process.env.NODE_ENV === 'production';
    }

    private createHttpsServer = () =>
        Https.createServer({ key: this.serverCert.privKey, cert: this.serverCert.cert }, this.app);

    private createHttpServer = () =>
        Http.createServer(this.app);
}