import { Service } from "typedi";
import { lazy } from "../domain/common/service/lazy";
import * as Fs from "fs";
import { findEnvOrThrow } from "../domain/common/service/find-env";

@Service()
export class ServerCert {
    private data = lazy(() => {
        return {
            cert: Fs.readFileSync(findEnvOrThrow("ARMAGEDDON_CERT")),
            privKey: Fs.readFileSync(findEnvOrThrow("ARMAGEDDON_PRIV_KEY")),
        };
    });

    get cert() {
        return this.data.value.cert;
    }

    get privKey() {
        return this.data.value.privKey;
    }
}