import { UserModel } from "./user-model";

export class JwRefreshTokenModel {
    constructor(
        public readonly id: string = "",
        public readonly user: UserModel = UserModel.empty,
        public readonly removed: boolean = false,
        public readonly created: number = 0,
        public readonly updated: number = 0,
    ) { }

    toRemoved(currDate: number) {
        return new JwRefreshTokenModel(
            this.id,
            this.user,
            true,
            this.created,
            currDate,
        );
    }
}