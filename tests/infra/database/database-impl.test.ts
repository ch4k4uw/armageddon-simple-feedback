import { anything, capture, instance, mock, verify, when } from "ts-mockito";
import { IDatabase } from "../../../src/infra/database/database";
import * as Uuid from "uuid";
import { DataSource, EntityManager, FindOneOptions, Repository, FindOptionsWhere } from "typeorm";
import { DatabaseImpl } from "../../../src/infra/database/database-impl";
import { JwRefreshTokenEntity } from "../../../src/infra/database/orm/jw-refresh-token.entity";
import { JwRefreshTokenModel } from "../../../src/infra/database/model/jw-refresh-token-model";
import { UserModel } from "../../../src/infra/database/model/user-model";
import { UserEntity } from "../../../src/infra/database/orm/user.entity";
import { also } from "../../../src/domain/common/service/also";

namespace DatabaseFixture {
    class Common {
        private constructor() { }
        static get userModel() {
            return new UserModel("a1", "b1", "c1", "d1", 1000, 1001);
        }

        static get userEntity() {
            return also(new UserEntity(), (e) => {
                e.id = this.userModel.id;
                e.firstName = this.userModel.firstName;
                e.lastName = this.userModel.lastName;
                e.email = this.userModel.email;
                e.created = this.userModel.created;
                e.updated = this.userModel.updated;
            });
        }
    }

    export namespace JwRefreshToken {
        export namespace Insert {
            export class Success {
                private constructor() { }
                static get jwRefreshTokenModel() {
                    return new JwRefreshTokenModel("a1", Common.userModel, false, 1000, 1001);
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
                    return new JwRefreshTokenModel("a2", Common.userModel, false, 2000, 2001);
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
                    return new JwRefreshTokenModel("a3", Common.userModel, false, 3000, 3001);
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
                    return new JwRefreshTokenModel("a4", Common.userModel, false, 4000, 4001);
                }

                static get jwRefreshTokenEntity() {
                    return also(new JwRefreshTokenEntity(), (e) => {
                        e.id = this.jwRefreshTokenModel.id;
                        e.user = Common.userEntity;
                        e.removed = this.jwRefreshTokenModel.removed;
                        e.created = this.jwRefreshTokenModel.created;
                        e.updated = this.jwRefreshTokenModel.updated;
                    });
                }
            }

            export class NotFound {
                private constructor() { }
                static get jwRefreshTokenModel() {
                    return new JwRefreshTokenModel("a5", Common.userModel, false, 5000, 5001);
                }
            }
        }

        export namespace Update {
            export class Success {
                private constructor() { }
                static get jwRefreshTokenModel() {
                    return new JwRefreshTokenModel("a6", Common.userModel, false, 6000, 6001);
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
}

interface IDataSourceSetupOptions {
    readonly jwRefreshTokenRepositoryMock?: Repository<JwRefreshTokenEntity>;
    readonly entityManager?: EntityManager;
}

describe('TypeOrm sqlite databaseimpl tests', () => {
    const createIdFn = async () => Uuid.v4();
    describe('misc tests', () => {
        let db: IDatabase;
        let dataSource: DataSource;
        beforeEach(() => {
            dataSource = setupDataSource();
            db = new DatabaseImpl(instance(dataSource), createIdFn);
        });

        test('should create a database id', async () => {
            const id = await db.createId();
            expect(id).not.toEqual("");
        });

        test('should return a valid date', async () => {
            const date = db.dateTime;
            const now = Date.now();
            expect(now - date).toBeLessThan(5000);
        });
    });

    function setupDataSource(options?: IDataSourceSetupOptions) {
        const result = mock<DataSource>();

        if (options?.jwRefreshTokenRepositoryMock) {
            when(result.getRepository(JwRefreshTokenEntity))
                .thenCall(() => instance(options?.jwRefreshTokenRepositoryMock));
        }

        if (options?.entityManager) {
            when(result.transaction(anything())).thenCall(async (...args: any[]) => {
                const fn: ((em: EntityManager | undefined) => Promise<void>) = args[0];
                return await fn(instance(options?.entityManager));
            });
        }

        return result;
    }

    describe('Jw token tests', () => {
        let db: IDatabase;
        let dataSource: DataSource;
        let repo: Repository<JwRefreshTokenEntity>;
        let entityManager: EntityManager;
        beforeEach(() => {
            repo = setupJwRefreshTokenRepository();
            entityManager = setupEntityManager({ jwRefreshTokenRepositoryMock: repo });
            dataSource = setupDataSource({ jwRefreshTokenRepositoryMock: repo, entityManager });
            db = new DatabaseImpl(instance(dataSource), createIdFn);
        });

        test('should insert a jw refresh token', async () => {
            await db.insertJwRefreshToken(DatabaseFixture.JwRefreshToken.Insert.Success.jwRefreshTokenModel);

            verify(dataSource.getRepository(JwRefreshTokenEntity)).once();
            verify(repo.create(anything())).once();
            verify(repo.save(anything())).once();

            const [creationParam] = capture(repo.create).first();
            const [savingParam] = capture(repo.save).first();

            expect({ ...creationParam }).toEqual({ ...DatabaseFixture.JwRefreshToken.Insert.Success.jwRefreshTokenEntity });
            expect({ ...savingParam }).toEqual({ ...DatabaseFixture.JwRefreshToken.Insert.Success.jwRefreshTokenEntity });
        });

        test('should insert and update some refresh tokens', async () => {
            await db.insertAndUpdateRefreshToken(
                DatabaseFixture.JwRefreshToken.UpdateAndInsert.Success.jwRefreshTokenModel1,
                DatabaseFixture.JwRefreshToken.UpdateAndInsert.Success.jwRefreshTokenModel2,
            );

            verify(dataSource.transaction(anything())).once();
            verify(entityManager.getRepository(JwRefreshTokenEntity)).once();
            verify(repo.update(anything(), anything())).once();
            verify(repo.create(anything())).once();
            verify(repo.save(anything())).once();

            const [ updateIdParam, updateEntityParam ] = capture(repo.update).first();
            const [ savingParam ] = capture(repo.save).first();

            expect({ ...savingParam }).toEqual({ ...DatabaseFixture.JwRefreshToken.UpdateAndInsert.Success.jwRefreshTokenEntity1 });
            expect(updateIdParam).toEqual({ id: DatabaseFixture.JwRefreshToken.UpdateAndInsert.Success.jwRefreshTokenEntity2.id });
            expect({ ...updateEntityParam }).toEqual({ ...DatabaseFixture.JwRefreshToken.UpdateAndInsert.Success.jwRefreshTokenEntity2 });

        });

        test('should find a refresh token', async () => {
            const result = await db.findJwRefreshTokenById(DatabaseFixture.JwRefreshToken.FindById.Success.jwRefreshTokenModel.id);
            expect({ ...result }).toEqual(DatabaseFixture.JwRefreshToken.FindById.Success.jwRefreshTokenModel);
            verify(dataSource.getRepository(anything())).once();
            verify(repo.findOne(anything())).once();
        });

        test('should find a refresh token', async () => {
            const result = await db.findJwRefreshTokenById(DatabaseFixture.JwRefreshToken.FindById.NotFound.jwRefreshTokenModel.id);
            expect(result).toBeNull();
            verify(dataSource.getRepository(anything())).once();
            verify(repo.findOne(anything())).once();
        });

        test('should update a refresh token', async () => {
            await db.updateJwRefreshToken(DatabaseFixture.JwRefreshToken.Update.Success.jwRefreshTokenModel);
            verify(dataSource.getRepository(anything())).once();
            verify(repo.update(anything(), anything())).once();

            const [ updateIdParam, updateEntityParam ] = capture(repo.update).first();
            expect(updateIdParam).toEqual({ id: DatabaseFixture.JwRefreshToken.Update.Success.jwRefreshTokenEntity.id });
            expect({ ...updateEntityParam }).toEqual({ ...DatabaseFixture.JwRefreshToken.Update.Success.jwRefreshTokenEntity });
        });
    });

    function setupJwRefreshTokenRepository() {
        const result = mock<Repository<JwRefreshTokenEntity>>();

        when(result.create(anything())).thenCall((...args: any[]) => {
            const result = args[0] as JwRefreshTokenEntity;
            return result;
        });
        when(result.save(anything())).thenResolve();
        when(result.update(anything(), anything())).thenResolve();

        when(result.findOne(anything())).thenCall(async (...args: any[]) => {
            const options = args[0] as FindOneOptions<JwRefreshTokenEntity>;
            const where = options?.where as FindOptionsWhere<JwRefreshTokenEntity>;
            if (where) {
                const id = where.id;
                switch(id) {
                    case DatabaseFixture.JwRefreshToken.FindById.Success.jwRefreshTokenEntity.id:
                        return DatabaseFixture.JwRefreshToken.FindById.Success.jwRefreshTokenEntity;
                    default:
                        return null;
                }
            }
            return null;
        });

        return result;
    }

    function setupEntityManager(options?: IDataSourceSetupOptions) {
        const result = mock<EntityManager>();

        if (options?.jwRefreshTokenRepositoryMock) {
            when(result.getRepository(JwRefreshTokenEntity))
                .thenCall(() => instance(options?.jwRefreshTokenRepositoryMock));
        }

        return result;
    }
});