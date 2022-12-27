import { also } from "../../../../src/domain/common/service/also";
import { Role } from "../../../../src/domain/credential/data/role";
import { CredentialModel } from "../../../../src/infra/database/model/credential-model";
import { JwRefreshTokenModel } from "../../../../src/infra/database/model/jw-refresh-token-model";
import { TopicModel } from "../../../../src/infra/database/model/topic-model";
import { UserModel } from "../../../../src/infra/database/model/user-model";
import { CredentialEntity } from "../../../../src/infra/database/orm/credential.entity";
import { JwRefreshTokenEntity } from "../../../../src/infra/database/orm/jw-refresh-token.entity";
import { TopicEntity } from "../../../../src/infra/database/orm/topic.entity";
import { UserEntity } from "../../../../src/infra/database/orm/user.entity";
import { lazy } from "../../../util/framework";

export namespace DatabaseFixture {
    class Common {
        private constructor() { }
        static get userModel1() {
            return new UserModel("a1", "b1", "c1", "d1", 1000, 1001);
        }

        static get userEntity1() {
            return also(new UserEntity(), (e) => {
                e.id = this.userModel1.id;
                e.firstName = this.userModel1.firstName;
                e.lastName = this.userModel1.lastName;
                e.email = this.userModel1.email;
                e.created = this.userModel1.created;
                e.updated = this.userModel1.updated;
            });
        }

        static get userModel2() {
            return new UserModel("a2", "b2", "c2", "d2", 2000, 2001);
        }

        static get userEntity2() {
            return also(new UserEntity(), (e) => {
                e.id = this.userModel2.id;
                e.firstName = this.userModel2.firstName;
                e.lastName = this.userModel2.lastName;
                e.email = this.userModel2.email;
                e.created = this.userModel2.created;
                e.updated = this.userModel2.updated;
            });
        }
    }

    export namespace JwRefreshToken {
        export namespace Insert {
            export class Success {
                private constructor() { }
                static get jwRefreshTokenModel() {
                    return new JwRefreshTokenModel("a1", Common.userModel1, false, 1000, 1001);
                }

                static get jwRefreshTokenEntity() {
                    return also(new JwRefreshTokenEntity(), (e) => {
                        e.id = this.jwRefreshTokenModel.id;
                        e.removed = this.jwRefreshTokenModel.removed;
                        e.created = this.jwRefreshTokenModel.created;
                        e.updated = this.jwRefreshTokenModel.updated;
                    });
                }
            }
        }

        export namespace UpdateAndInsert {
            export class Success {
                private constructor() { }
                static get jwRefreshTokenModel1() {
                    return new JwRefreshTokenModel("a2", Common.userModel1, false, 2000, 2001);
                }

                static get jwRefreshTokenEntity1() {
                    return also(new JwRefreshTokenEntity(), (e) => {
                        e.id = this.jwRefreshTokenModel1.id;
                        e.removed = this.jwRefreshTokenModel1.removed;
                        e.created = this.jwRefreshTokenModel1.created;
                        e.updated = this.jwRefreshTokenModel1.updated;
                    });
                }

                static get jwRefreshTokenModel2() {
                    return new JwRefreshTokenModel("a3", Common.userModel1, false, 3000, 3001);
                }

                static get jwRefreshTokenEntity2() {
                    return also(new JwRefreshTokenEntity(), (e) => {
                        e.id = this.jwRefreshTokenModel2.id;
                        e.removed = this.jwRefreshTokenModel2.removed;
                        e.created = this.jwRefreshTokenModel2.created;
                        e.updated = this.jwRefreshTokenModel2.updated;
                    });
                }
            }
        }

        export namespace FindById {
            export class Success {
                private constructor() { }
                static get jwRefreshTokenModel() {
                    return new JwRefreshTokenModel("a4", Common.userModel1, false, 4000, 4001);
                }

                static get jwRefreshTokenEntity() {
                    return also(new JwRefreshTokenEntity(), (e) => {
                        e.id = this.jwRefreshTokenModel.id;
                        e.user = Common.userEntity1;
                        e.removed = this.jwRefreshTokenModel.removed;
                        e.created = this.jwRefreshTokenModel.created;
                        e.updated = this.jwRefreshTokenModel.updated;
                    });
                }
            }

            export class NotFound {
                private constructor() { }
                static get jwRefreshTokenModel() {
                    return new JwRefreshTokenModel("a5", Common.userModel1, false, 5000, 5001);
                }
            }
        }

        export namespace Update {
            export class Success {
                private constructor() { }
                static get jwRefreshTokenModel() {
                    return new JwRefreshTokenModel("a6", Common.userModel1, false, 6000, 6001);
                }

                static get jwRefreshTokenEntity() {
                    return also(new JwRefreshTokenEntity(), (e) => {
                        e.id = this.jwRefreshTokenModel.id;
                        e.removed = this.jwRefreshTokenModel.removed;
                        e.created = this.jwRefreshTokenModel.created;
                        e.updated = this.jwRefreshTokenModel.updated;
                    });
                }
            }
        }
    }

    export namespace User {
        export namespace FindById {
            export class Success {
                private constructor() { }
                static get userModel() {
                    return Common.userModel1;
                }

                static get userEntity() {
                    return Common.userEntity1;
                }
            }

            export class NotFound {
                private constructor() { }
                static get userModel() {
                    return Common.userModel2;
                }
            }
        }
    }

    export namespace Credential {
        export namespace FindByLogin {
            export class Success {
                private constructor() { }
                static get credentialEntity() {
                    return also(new CredentialEntity(), (e) => {
                        e.login = "a1";
                        e.userId = "b1";
                        e.password = "c1";
                        e.role = CredentialEntity.ROLE_ADMIN;
                    });
                }

                static get credentialModel() {
                    return new CredentialModel(
                        this.credentialEntity.userId,
                        this.credentialEntity.login,
                        this.credentialEntity.password,
                        [Role[Role.admin]],
                    );
                }
            }

            export class NotFound {
                private constructor() { }
                static get credentialEntity() {
                    return also(new CredentialEntity(), (e) => {
                        e.login = "a2";
                        e.userId = "b2";
                        e.password = "c2";
                        e.role = CredentialEntity.ROLE_ADMIN;
                    });
                }
            }
        }
    }

    export namespace Topic {
        export namespace Insert {
            export class Success {
                private constructor() { }
                static get topicModel() {
                    return new TopicModel(
                        "a1",
                        "b1",
                        "C1",
                        "D1",
                        "e1",
                        "f1",
                        1000,
                        1001,
                        1002,
                    );
                }

                static get topicEntity() {
                    return also(new TopicEntity(), (e) => {
                        e.id = this.topicModel.id;
                        e.code = this.topicModel.code;
                        e.title = this.topicModel.title;
                        e.lowerTitle = this.topicModel.title.toLowerCase();
                        e.description = this.topicModel.description;
                        e.lowerDescription = this.topicModel.description.toLowerCase();
                        e.author = this.topicModel.author;
                        e.authorName = this.topicModel.authorName;
                        e.expires = this.topicModel.expires;
                        e.created = this.topicModel.created;
                        e.updated = this.topicModel.updated;
                    });
                }
            }
        }

        export namespace Update {
            export class Success {
                private constructor() { }
                static get topicModel() {
                    return new TopicModel(
                        "a2",
                        "b2",
                        "C2",
                        "D2",
                        "e2",
                        "f2",
                        2000,
                        2001,
                        2002,
                    );
                }

                static get topicEntity() {
                    return also(new TopicEntity(), (e) => {
                        e.id = this.topicModel.id;
                        e.code = this.topicModel.code;
                        e.title = this.topicModel.title;
                        e.lowerTitle = this.topicModel.title.toLowerCase();
                        e.description = this.topicModel.description;
                        e.lowerDescription = this.topicModel.description.toLowerCase();
                        e.author = this.topicModel.author;
                        e.authorName = this.topicModel.authorName;
                        e.expires = this.topicModel.expires;
                        e.created = this.topicModel.created;
                        e.updated = this.topicModel.updated;
                    });
                }
            }
        }

        export namespace DeleteById {
            export class Success {
                private constructor() { }
                static get topicModel() {
                    return Insert.Success.topicModel;
                }
            }
        }

        export namespace FindById {
            export class Success {
                private constructor() { }
                static get topicModel() {
                    return Insert.Success.topicModel;
                }

                static get topicEntity() {
                    return Insert.Success.topicEntity;
                }
            }

            export class NotFound {
                private constructor() { }
                static get topicModel() {
                    return Update.Success.topicModel;
                }
            }
        }

        export namespace FindByCode {
            export class Success {
                private constructor() { }
                static get topicModel() {
                    return Insert.Success.topicModel;
                }

                static get topicEntity() {
                    return Insert.Success.topicEntity;
                }
            }

            export class NotFound {
                private constructor() { }
                static get topicModel() {
                    return Update.Success.topicModel;
                }
            }
        }

        export namespace FindExistsByTitle {
            export class Success {
                private constructor() { }
                static get topicModel() {
                    return Insert.Success.topicModel;
                }

                static get topicEntity() {
                    return Insert.Success.topicEntity;
                }
            }

            export class NotFound {
                private constructor() { }
                static get topicModel() {
                    return Update.Success.topicModel;
                }
            }
        }

        export namespace FindExistsByCode {
            export class Success {
                private constructor() { }
                static get topicModel() {
                    return Insert.Success.topicModel;
                }

                static get topicEntity() {
                    return Insert.Success.topicEntity;
                }
            }

            export class NotFound {
                private constructor() { }
                static get topicModel() {
                    return Update.Success.topicModel;
                }
            }
        }

        export namespace FindPage {
            export class Success {
                private constructor() { }
                private static _topicEntityList = lazy(() => {
                    const result: TopicEntity[] = [];

                    for (let i=0; i<27; ++i) {
                        const suffix = i+1;
                        result.push(
                            also(new TopicEntity(), (e) => {
                                e.id = `al${suffix}`;
                                e.code = `bl${suffix}`;
                                e.title = `Cl${suffix}`;
                                e.lowerTitle = `cl${suffix}`;
                                e.description = `Dl${suffix}`;
                                e.lowerDescription = `dl${suffix}`;
                                e.author = `el${suffix}`;
                                e.authorName = `fl${suffix}`;
                                e.expires = 1000 * suffix;
                                e.created = e.expires + 1;
                                e.updated = e.expires + 2;
                            })
                        );
                    }

                    return result;
                });

                static get topicEntityList() {
                    return this._topicEntityList.value;
                }

                static get topicModelList() {
                    return this.topicEntityList.map(v => {
                        return new TopicModel(
                            v.id, 
                            v.code, 
                            v.title, 
                            v.description, 
                            v.author, 
                            v.authorName, 
                            v.expires, 
                            v.created, 
                            v.updated
                        )
                    });
                }

                static get pageIndex() {
                    return 2;
                }

                static get pageSize() {
                    return 10;
                }

                static get pageTotal() {
                    return 3;
                }
            }
        }

    }
}