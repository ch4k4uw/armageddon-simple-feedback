import { User } from "../../../../src/domain/common/entity/user";
import { JwToken } from "../../../../src/domain/token/entity/jw-token";
import { CommonFixture } from "../../common/stuff/common-fixture";

export namespace UserFixture {
    export class FindLogged {
        private constructor() { }
        static get successJwToken(): JwToken {
            return CommonFixture.jwToken1;
        }

        static get userNotFoundJwToken(): JwToken {
            return this.successJwToken.cloneWith(
                undefined,
                CommonFixture.loggedUser1.cloneWith(
                    'id-not-found1', 'name-not-found1', []
                ),
                false,
                true,
            );
        }

        static get successUser(): User {
            return CommonFixture.user1;
        }

        static get invalidAccessToken(): JwToken {
            return CommonFixture.jwToken1.cloneWith(undefined, undefined, false, false);
        }

        static get expiredAccessToken(): JwToken {
            return this.invalidAccessToken.cloneWith(undefined, undefined, true, true);
        }
    }
}