import { anyNumber, anyString, anything, capture, instance, mock, verify, when } from "ts-mockito";
import { IDatabase } from "../../../src/infra/database/database";
import * as Uuid from "uuid";
import { DataSource, EntityManager, FindOneOptions, Repository, FindOptionsWhere, FindManyOptions, SelectQueryBuilder } from "typeorm";
import { DatabaseImpl } from "../../../src/infra/database/database-impl";
import { JwRefreshTokenEntity } from "../../../src/infra/database/orm/jw-refresh-token.entity";
import { DatabaseFixture } from "./stuff/database-fixture";
import { UserEntity } from "../../../src/infra/database/orm/user.entity";
import { CredentialEntity } from "../../../src/infra/database/orm/credential.entity";
import { TopicEntity } from "../../../src/infra/database/orm/topic.entity";
import { FeedbackEntity } from "../../../src/infra/database/orm/feedback.entity";
import { resourceLimits } from "worker_threads";
import { PagedModel } from "../../../src/infra/database/model/paged-model";
import { TopicModel } from "../../../src/infra/database/model/topic-model";
import { FeedbackModel } from "../../../src/infra/database/model/feedback-model";


interface IDataSourceSetupOptions {
    readonly jwRefreshTokenRepositoryMock?: Repository<JwRefreshTokenEntity>;
    readonly userRepositoryMock?: Repository<UserEntity>;
    readonly credentialRepositoryMock?: Repository<CredentialEntity>;
    readonly topicRepositoryMock?: Repository<TopicEntity>;
    readonly feedbackRepositoryMock?: Repository<FeedbackEntity>;
    readonly entityManager?: EntityManager;
}

describe('TypeOrm sqlite databaseimpl tests', () => {
    const createIdFn = async () => Uuid.v4();
    let db: IDatabase;
    let dataSource: DataSource;
    let jwRefreshTokenRepo: Repository<JwRefreshTokenEntity>;
    let userRepo: Repository<UserEntity>;
    let credentialRepo: Repository<CredentialEntity>;
    let topicRepo: Repository<TopicEntity>;
    let feedbackRepo: Repository<FeedbackEntity>;
    let entityManager: EntityManager;
    describe('misc tests', () => {
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

        if (options?.userRepositoryMock) {
            when(result.getRepository(UserEntity))
                .thenCall(() => instance(options?.userRepositoryMock));
        }

        if (options?.credentialRepositoryMock) {
            when(result.getRepository(CredentialEntity))
                .thenCall(() => instance(options?.credentialRepositoryMock));
        }

        if (options?.topicRepositoryMock) {
            when(result.getRepository(TopicEntity))
                .thenCall(() => instance(options?.topicRepositoryMock));
        }

        if (options?.feedbackRepositoryMock) {
            when(result.getRepository(FeedbackEntity))
                .thenCall(() => instance(options?.feedbackRepositoryMock));
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
        beforeEach(() => {
            jwRefreshTokenRepo = setupJwRefreshTokenRepository();
            entityManager = setupEntityManager({ jwRefreshTokenRepositoryMock: jwRefreshTokenRepo });
            dataSource = setupDataSource({ jwRefreshTokenRepositoryMock: jwRefreshTokenRepo, entityManager });
            db = new DatabaseImpl(instance(dataSource), createIdFn);
        });

        test('should insert a jw refresh token', async () => {
            await db.insertJwRefreshToken(DatabaseFixture.JwRefreshToken.Insert.Success.jwRefreshTokenModel);

            verify(dataSource.getRepository(JwRefreshTokenEntity)).once();
            verify(jwRefreshTokenRepo.create(anything())).once();
            verify(jwRefreshTokenRepo.save(anything())).once();

            const [creationParam] = capture(jwRefreshTokenRepo.create).first();
            const [savingParam] = capture(jwRefreshTokenRepo.save).first();

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
            verify(jwRefreshTokenRepo.update(anything(), anything())).once();
            verify(jwRefreshTokenRepo.create(anything())).once();
            verify(jwRefreshTokenRepo.save(anything())).once();

            const [updateIdParam, updateEntityParam] = capture(jwRefreshTokenRepo.update).first();
            const [savingParam] = capture(jwRefreshTokenRepo.save).first();

            expect({ ...savingParam }).toEqual({ ...DatabaseFixture.JwRefreshToken.UpdateAndInsert.Success.jwRefreshTokenEntity1 });
            expect(updateIdParam).toEqual({ id: DatabaseFixture.JwRefreshToken.UpdateAndInsert.Success.jwRefreshTokenEntity2.id });
            expect({ ...updateEntityParam }).toEqual({ ...DatabaseFixture.JwRefreshToken.UpdateAndInsert.Success.jwRefreshTokenEntity2 });

        });

        describe('Jw refresh token tests', () => {
            test('should find a refresh token', async () => {
                const result = await db.findJwRefreshTokenById(DatabaseFixture.JwRefreshToken.FindById.Success.jwRefreshTokenModel.id);
                expect({ ...result }).toEqual(DatabaseFixture.JwRefreshToken.FindById.Success.jwRefreshTokenModel);
                verify(dataSource.getRepository(anything())).once();
                verify(jwRefreshTokenRepo.findOne(anything())).once();
            });

            test('should find a refresh token', async () => {
                const result = await db.findJwRefreshTokenById(DatabaseFixture.JwRefreshToken.FindById.NotFound.jwRefreshTokenModel.id);
                expect(result).toBeNull();
                verify(dataSource.getRepository(anything())).once();
                verify(jwRefreshTokenRepo.findOne(anything())).once();
            });

            test('should update a refresh token', async () => {
                await db.updateJwRefreshToken(DatabaseFixture.JwRefreshToken.Update.Success.jwRefreshTokenModel);
                verify(dataSource.getRepository(anything())).once();
                verify(jwRefreshTokenRepo.update(anything(), anything())).once();

                const [updateIdParam, updateEntityParam] = capture(jwRefreshTokenRepo.update).first();
                expect(updateIdParam).toEqual({ id: DatabaseFixture.JwRefreshToken.Update.Success.jwRefreshTokenEntity.id });
                expect({ ...updateEntityParam }).toEqual({ ...DatabaseFixture.JwRefreshToken.Update.Success.jwRefreshTokenEntity });
            });
        });
    });

    describe('User tests', () => {
        beforeEach(() => {
            userRepo = setupUserRepository();
            dataSource = setupDataSource({ userRepositoryMock: userRepo });
            db = new DatabaseImpl(instance(dataSource), createIdFn);
        });

        test('should find an user', async () => {
            const result = await db.findUserById(DatabaseFixture.User.FindById.Success.userModel.id);

            expect({ ...result }).toEqual({ ...DatabaseFixture.User.FindById.Success.userModel });
            verify(userRepo.findOneBy(anything())).once();
        });

        test('shouldn\'t find an user', async () => {
            const result = await db.findUserById(DatabaseFixture.User.FindById.NotFound.userModel.id);

            expect(result).toBeNull();
            verify(userRepo.findOneBy(anything())).once();
        });
    });

    describe('Credential tests', () => {
        beforeEach(() => {
            credentialRepo = setupCredentialRepository();
            dataSource = setupDataSource({ credentialRepositoryMock: credentialRepo });
            db = new DatabaseImpl(instance(dataSource), createIdFn);
        });

        test('should find a credential', async () => {
            const result = await db.findCredentialByLogin(
                DatabaseFixture.Credential.FindByLogin.Success.credentialModel.login
            );

            expect({ ...result }).toEqual({ ...DatabaseFixture.Credential.FindByLogin.Success.credentialModel });
            verify(credentialRepo.findOneBy(anything())).once();
        });

        test('shouldn\'t find n credential', async () => {
            const result = await db.findCredentialByLogin(
                DatabaseFixture.Credential.FindByLogin.NotFound.credentialEntity.login
            );

            expect(result).toBeNull();
            verify(credentialRepo.findOneBy(anything())).once();
        });
    });

    describe('Topic tests', () => {
        let selectQueryBuilder: SelectQueryBuilder<TopicEntity>;
        beforeEach(() => {
            selectQueryBuilder = setupTopicSelectQueryBuilder();
            topicRepo = setupTopicRepository(selectQueryBuilder);
            dataSource = setupDataSource({ topicRepositoryMock: topicRepo });
            db = new DatabaseImpl(instance(dataSource), createIdFn);
        });

        test('should insert a topic', async () => {
            await db.insertTopic(
                DatabaseFixture.Topic.Insert.Success.topicModel
            );

            verify(dataSource.getRepository(anything())).once();
            verify(topicRepo.create(anything())).once();
            verify(topicRepo.save(anything())).once();

            const [insertEntityParam] = capture(topicRepo.create).first();

            expect({ ...insertEntityParam }).toEqual({
                ...DatabaseFixture.Topic.Insert.Success.topicEntity
            });
        });

        test('should update a topic', async () => {
            await db.updateTopic(
                DatabaseFixture.Topic.Update.Success.topicModel
            );

            verify(dataSource.getRepository(anything())).once();
            verify(topicRepo.update(anything(), anything())).once();

            const [updateIdParam, updateEntityParam] = capture(topicRepo.update).first();

            expect(updateIdParam).toEqual({
                id: DatabaseFixture.Topic.Update.Success.topicModel.id
            });
            expect(updateEntityParam).toEqual({
                ...DatabaseFixture.Topic.Update.Success.topicEntity
            });
        });

        test('should remove a topic', async () => {
            await db.removeTopicById(
                DatabaseFixture.Topic.DeleteById.Success.topicModel.id
            );

            verify(dataSource.getRepository(anything())).once();
            verify(topicRepo.delete(anything())).once();
        });

        describe('Find by id tests', () => {
            test('should find a topic', async () => {
                const result = await db.findTopicById(
                    DatabaseFixture.Topic.FindById.Success.topicModel.id
                );

                expect({ ...result }).toEqual({
                    ...DatabaseFixture.Topic.FindById.Success.topicModel
                });
                verify(dataSource.getRepository(anything())).once();
                verify(topicRepo.findOneBy(anything())).once();
            });

            test('shouldn\'t find a topic', async () => {
                const result = await db.findTopicById(
                    DatabaseFixture.Topic.FindById.NotFound.topicModel.id
                );

                expect(result).toBeNull();
                verify(dataSource.getRepository(anything())).once();
                verify(topicRepo.findOneBy(anything())).once();
            });
        });

        describe('Find by code tests', () => {
            test('should find a topic', async () => {
                const result = await db.findTopicByCode(
                    DatabaseFixture.Topic.FindByCode.Success.topicModel.id
                );

                expect({ ...result }).toEqual({
                    ...DatabaseFixture.Topic.FindByCode.Success.topicModel
                });
                verify(dataSource.getRepository(anything())).once();
                verify(topicRepo.findOneBy(anything())).once();
            });

            test('shouldn\'t find a topic', async () => {
                const result = await db.findTopicById(
                    DatabaseFixture.Topic.FindByCode.NotFound.topicModel.id
                );

                expect(result).toBeNull();
                verify(dataSource.getRepository(anything())).once();
                verify(topicRepo.findOneBy(anything())).once();
            });

        });

        describe('Find exists by title tests', () => {
            test('should find a topic', async () => {
                const result = await db.findTopicExistsByTitle(
                    DatabaseFixture.Topic.FindExistsByTitle.Success.topicEntity.lowerTitle
                );

                expect(result).toEqual(true);
                verify(dataSource.getRepository(anything())).once();
                verify(topicRepo.find(anything())).once();
            });

            test('shouldn\'t find a topic', async () => {
                const result = await db.findTopicExistsByTitle(
                    DatabaseFixture.Topic.FindExistsByTitle.NotFound.topicModel.title.toLowerCase()
                );

                expect(result).toEqual(false);
                verify(dataSource.getRepository(anything())).once();
                verify(topicRepo.find(anything())).once();
            });

        });

        test('should find a topic page', async () => {
            const result = await db.findTopicPage(
                DatabaseFixture.Topic.FindPage.Success.pageIndex,
                DatabaseFixture.Topic.FindPage.Success.pageSize
            );

            const pageIndex = DatabaseFixture.Topic.FindPage.Success.pageIndex;
            const pageSize = DatabaseFixture.Topic.FindPage.Success.pageSize;
            const startOffset = (pageIndex - 1) * pageSize;
            const endOffset = startOffset + pageSize;

            expect({ ...result }).toEqual({
                ...new PagedModel<TopicModel>(
                    DatabaseFixture.Topic.FindPage.Success.topicModelList.slice(startOffset, endOffset),
                    pageSize,
                    pageIndex,
                    DatabaseFixture.Topic.FindPage.Success.pageTotal,
                )
            });
        });

    });

    describe('Feedback tests', () => {
        beforeEach(() => {
            feedbackRepo = setupFeedbackRepository();
            dataSource = setupDataSource({ feedbackRepositoryMock: feedbackRepo });
            db = new DatabaseImpl(instance(dataSource), createIdFn);
        });

        test('should insert a feedback', async () => {
            await db.insertFeedback(DatabaseFixture.Feedback.Insert.Success.feedbackModel);

            verify(dataSource.getRepository(anything())).once();
            verify(feedbackRepo.save(anything())).once();

            const [insertParam] = capture(feedbackRepo.save).first();

            expect({ ...insertParam }).toEqual({
                ...DatabaseFixture.Feedback.Insert.Success.feedbackEntity
            });
        });
        describe('Find by id tests', () => {
            test('should find a feedback', async () => {
                const result = await db.findFeedbackById(
                    DatabaseFixture.Feedback.FindById.Success.feedbackModel.id
                );

                expect({ ...result }).toEqual({
                    ...DatabaseFixture.Feedback.FindById.Success.feedbackModel
                });
                verify(dataSource.getRepository(anything())).once();
                verify(feedbackRepo.findOneBy(anything())).once();
            });

            test('shouldn\'t find a feedback', async () => {
                const result = await db.findFeedbackById(
                    DatabaseFixture.Feedback.FindById.NotFound.feedbackEntity.id
                );

                expect(result).toBeNull();
                verify(dataSource.getRepository(anything())).once();
                verify(feedbackRepo.findOneBy(anything())).once();
            });
        });

        describe('Find summary by topic id tests', () => {
            let qbForSummary: SelectQueryBuilder<FeedbackEntity>;
            beforeEach(() => {
                qbForSummary = setupFeedbackSelectQueryBuilderForSummary();
                feedbackRepo = setupFeedbackRepository(qbForSummary);
                dataSource = setupDataSource({ feedbackRepositoryMock: feedbackRepo });
                db = new DatabaseImpl(instance(dataSource), createIdFn);
            });

            test('should find the summary', async () => {
                const result = await db.findFeedbackSummariesByTopicId(
                    "1"
                );

                expect(result).toEqual(
                    DatabaseFixture.Feedback.FindSummaryByTopicId.Success.feedbackSummaryModel
                );

                verify(dataSource.getRepository(anything())).once();
                verify(feedbackRepo.createQueryBuilder(anyString())).once();
                verify(qbForSummary.getMany()).once();
            });
        });

        describe('Find feedback page tests', () => {
            let qbForPage: SelectQueryBuilder<FeedbackEntity>;
            beforeEach(() => {
                qbForPage = setupFeedbackSelectQueryBuilderForPage();
                feedbackRepo = setupFeedbackRepository(undefined, qbForPage);
                dataSource = setupDataSource({ feedbackRepositoryMock: feedbackRepo });
                db = new DatabaseImpl(instance(dataSource), createIdFn);
            });
            test('should find a page', async () => {
                const result = await db.findFeedbackPage(
                    "1",
                    DatabaseFixture.Feedback.FindPage.Success.pageIndex,
                    DatabaseFixture.Feedback.FindPage.Success.pageSize,
                    { rating: 1, reason: "test" }
                );

                const pageIndex = DatabaseFixture.Feedback.FindPage.Success.pageIndex;
                const pageSize = DatabaseFixture.Feedback.FindPage.Success.pageSize;
                const startOffset = (pageIndex - 1) * pageSize;
                const endOffset = startOffset + pageSize;

                expect({ ...result }).toEqual({
                    ...new PagedModel<FeedbackModel>(
                        DatabaseFixture.Feedback.FindPage.Success.feedbackModelList.slice(startOffset, endOffset),
                        pageSize,
                        pageIndex,
                        DatabaseFixture.Topic.FindPage.Success.pageTotal,
                    )
                });

                verify(dataSource.getRepository(anything())).once();
                verify(qbForPage.getMany()).once();
                verify(qbForPage.getCount()).once();
            });
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
                switch (id) {
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

    function setupUserRepository() {
        const result = mock<Repository<UserEntity>>();

        when(result.findOneBy(anything())).thenCall((...args: any[]) => {
            if (args[0] instanceof Array) {
                return null;
            }
            const where = args[0] as FindOptionsWhere<UserEntity>;
            switch (where.id) {
                case DatabaseFixture.User.FindById.Success.userModel.id:
                    return DatabaseFixture.User.FindById.Success.userEntity;
                default:
                    return null;
            }
        });

        return result;
    }

    function setupCredentialRepository() {
        const result = mock<Repository<CredentialEntity>>();

        when(result.findOneBy(anything())).thenCall((...args: any[]) => {
            if (args[0] instanceof Array) {
                return null;
            }
            const where = args[0] as FindOptionsWhere<CredentialEntity>;
            switch (where.login) {
                case DatabaseFixture.Credential.FindByLogin.Success.credentialEntity.login:
                    return DatabaseFixture.Credential.FindByLogin.Success.credentialEntity;
                default:
                    return null;
            }
        });

        return result;
    }

    function setupTopicRepository(selectQueryBuilder?: SelectQueryBuilder<TopicEntity>) {
        const result = mock<Repository<TopicEntity>>();

        when(result.create(anything())).thenCall((...args: any[]) => args[0]);

        when(result.save(anything())).thenResolve();
        when(result.update(anything(), anything())).thenResolve();
        when(result.delete(anything())).thenResolve();

        when(result.findOneBy(anything())).thenCall(async (...args: any[]) => {
            if (args[0] instanceof Array) {
                return null;
            }
            const where = args[0] as FindOptionsWhere<TopicEntity>;
            switch (where.id) {
                case DatabaseFixture.Topic.FindById.Success.topicEntity.id:
                    return DatabaseFixture.Topic.FindById.Success.topicEntity;
            }

            switch (where.code) {
                case DatabaseFixture.Topic.FindByCode.Success.topicEntity.id:
                    return DatabaseFixture.Topic.FindByCode.Success.topicEntity;
            }
            return null;
        });

        when(result.find(anything())).thenCall(async (...args: any[]) => {
            const options = args[0] as FindManyOptions<TopicEntity>;
            const where = options.where;
            if (where instanceof Array) {
                return [];
            }
            switch (where?.title) {
                case DatabaseFixture.Topic.FindExistsByTitle.Success.topicEntity.lowerTitle:
                    return [DatabaseFixture.Topic.FindExistsByTitle.Success.topicEntity];
                default:
                    return [];
            }
        });

        when(result.findOne(anything())).thenCall(async (...args: any[]) => {
            const options = args[0] as FindOneOptions<TopicEntity>;
            const where = options.where;
            if (where instanceof Array) {
                return null;
            }
            switch (where?.title) {
                case DatabaseFixture.Topic.FindExistsByCode.Success.topicEntity.title:
                    return DatabaseFixture.Topic.FindExistsByCode.Success.topicEntity;
                default:
                    return null;
            }
        });

        if (selectQueryBuilder) {
            when(result.createQueryBuilder(anything())).thenCall(() => instance(selectQueryBuilder));
        }

        return result;
    }

    function setupTopicSelectQueryBuilder() {
        const result = mock<SelectQueryBuilder<TopicEntity>>();

        when(result.where(anything(), anything())).thenCall(() => instance(result));
        when(result.limit(anyNumber())).thenCall(() => instance(result));
        when(result.offset(anyNumber())).thenCall(() => instance(result));
        when(result.orderBy(anyString(), anyString())).thenCall(() => instance(result));
        const pageIndex = DatabaseFixture.Topic.FindPage.Success.pageIndex;
        const pageSize = DatabaseFixture.Topic.FindPage.Success.pageSize;
        const startOffset = (pageIndex - 1) * pageSize;
        const endOffset = startOffset + pageSize;
        when(result.getMany()).thenResolve(
            DatabaseFixture.Topic.FindPage.Success.topicEntityList.slice(
                startOffset,
                endOffset,
            )
        );
        when(result.getCount()).thenResolve(
            DatabaseFixture.Topic.FindPage.Success.topicEntityList.length
        )

        return result;
    }

    function setupFeedbackRepository(
        qbForSummary?: SelectQueryBuilder<FeedbackEntity>,
        qbForPage?: SelectQueryBuilder<FeedbackEntity>,
    ) {
        const result = mock<Repository<FeedbackEntity>>();

        when(result.create(anything())).thenCall((...args: any[]) => args[0]);

        when(result.save(anything())).thenResolve();

        if (qbForSummary) {
            when(result.createQueryBuilder(anything())).thenCall(() => instance(qbForSummary));
        }

        if (qbForPage) {
            when(result.createQueryBuilder(anything())).thenCall(() => instance(qbForPage));
        }

        when(result.findOneBy(anything())).thenCall(async (...args: any[]) => {
            if (args[0] instanceof Array) {
                return null;
            }
            const where = args[0] as FindOptionsWhere<FeedbackEntity>;
            switch (where.id) {
                case DatabaseFixture.Feedback.FindById.Success.feedbackEntity.id:
                    return DatabaseFixture.Feedback.FindById.Success.feedbackEntity;
            }
            return null;
        });

        return result;
    }

    function setupFeedbackSelectQueryBuilderForSummary() {
        const result = mock<SelectQueryBuilder<FeedbackEntity>>();

        when(result.select(anyString())).thenCall(() => instance(result));
        when(result.where(anything(), anything())).thenCall(() => instance(result));
        when(result.getMany()).thenResolve(
            DatabaseFixture.Feedback.FindSummaryByTopicId.Success.feedbackSummaryEntity
        );

        return result;
    }

    function setupFeedbackSelectQueryBuilderForPage() {
        const result = mock<SelectQueryBuilder<FeedbackEntity>>();

        when(result.where(anyString(), anything())).thenCall(() => instance(result));
        when(result.orWhere(anyString(), anything())).thenCall(() => instance(result));
        when(result.andWhere(anyString(), anything())).thenCall(() => instance(result));
        when(result.limit(anyNumber())).thenCall(() => instance(result));
        when(result.offset(anyNumber())).thenCall(() => instance(result));
        when(result.orderBy(anyString(), anyString())).thenCall(() => instance(result));
        const pageIndex = DatabaseFixture.Feedback.FindPage.Success.pageIndex;
        const pageSize = DatabaseFixture.Feedback.FindPage.Success.pageSize;
        const startOffset = (pageIndex - 1) * pageSize;
        const endOffset = startOffset + pageSize;
        when(result.getMany()).thenResolve(
            DatabaseFixture.Feedback.FindPage.Success.feedbackEntityList.slice(
                startOffset,
                endOffset,
            )
        );
        when(result.getCount()).thenResolve(
            DatabaseFixture.Topic.FindPage.Success.topicEntityList.length
        )

        return result;
    }
});