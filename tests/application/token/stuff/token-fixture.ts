import { JwToken } from "../../../../src/domain/token/entity/jw-token";
import { RawJwToken } from "../../../../src/domain/token/data/raw-jw-token";
import { CommonFixture } from "../../common/stuff/common-fixture";

export namespace TokenFixture {
    export class AccessToken {
        private constructor() { }
        static get successAccessToken(): RawJwToken {
            return CommonFixture.rawJwToken1;
        }
    
        static get successJwToken(): JwToken {
            return CommonFixture.jwToken1;
        }

        static get invalidAccessToken(): RawJwToken {
            return new RawJwToken();
        }
    }

    export class RefreshToken {
        private constructor() { }
        static get successRefreshToken(): RawJwToken {
            return CommonFixture.rawJwToken1;
        }

        static get successJwToken(): JwToken {
            return AccessToken.successJwToken;
        }

        static get invalidRefreshToken(): RawJwToken {
            return new RawJwToken();
        }
    }

    export class Refreshing {
        private constructor() { }
        static get successJwToken(): JwToken {
            return CommonFixture.jwToken1;
        }

        static get successRawJwToken(): RawJwToken {
            return CommonFixture.rawJwToken1;
        }

        static get invalidJwToken(): JwToken {
            return this.successJwToken.cloneWith(undefined, undefined, false, false);
        }

        static get expiredJwToken(): JwToken {
            return this.successJwToken.cloneWith(undefined, undefined, true, true);
        }
    }
}