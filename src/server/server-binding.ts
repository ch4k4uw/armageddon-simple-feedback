import { Service } from "typedi";
import { findEnvOrThrow } from "../domain/common/service/find-env";

@Service()
export class ServerBinding {
    get port() {
        return parseInt(findEnvOrThrow("ARMAGEDDON_SERVER_PORT"));
    }

    get forceHttps() {
        return parseInt(findEnvOrThrow("ARMAGEDDON_SERVER_FORCE_HTTPS")) == 1;
    }
}