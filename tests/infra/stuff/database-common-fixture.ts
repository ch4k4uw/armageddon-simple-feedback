import { Role } from "../../../src/domain/credential/data/role";
import { CredentialModel } from "../../../src/infra/database/model/credential-model";
import { UserModel } from "../../../src/infra/database/model/user-model";

export namespace DatabaseCommonFixture {
    let currId = 0;
    
    export function nextId(): string {
        return `${++currId}`;
    }

    export class User {
        private constructor() { }
        private static date1 = Date.now();

        static get user1() {
            return new UserModel("a1", "b1", "c1", "d1", this.date1, this.date1);
        }
    }

    export class Credential {
        private constructor() { }
        static get credential1() {
            return new CredentialModel(
                User.user1.id,
                "a1",
                "b1",
                [Role[Role.admin]]
            )
        }
    }
}