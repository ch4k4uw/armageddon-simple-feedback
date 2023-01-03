import * as Express from "express";
import { Service } from "typedi";

@Service()
export class RequestAuthHeaderParser {
    parse(req: Express.Request): string | undefined {
        return this.parseToken(this.parseRawToken(req));
    }

    private parseRawToken(req: Express.Request): string | undefined {
        return (req.headers['Authorization'] || req.headers['authorization']) as string | undefined;
    }

    private parseToken(rawToken: string | undefined): string | undefined {
        return rawToken ? rawToken.replace(/Bearer/gi, '').replace(/ /g, '') : undefined;
    }
}