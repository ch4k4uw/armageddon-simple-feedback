import { UserModel } from "./user-model";

export class JwRefreshTokenModel {
    constructor(
        public readonly id: string = "",
        public readonly user: UserModel = UserModel.empty,
        public readonly removed: boolean = false,
        public readonly created: number = 0,
        public readonly updaed: number = 0,
    ) { }
    
    get asRemoved() {
        return new JwRefreshTokenModel(
            this.id,
            this.user,
            true,
            this.created,
            Date.now()
        );
    }
}