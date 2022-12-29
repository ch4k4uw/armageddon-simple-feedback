import { DataSource, Entity, FindOptionsWhere } from "typeorm";
import { also } from "../../domain/common/service/also";
import { Role } from "../../domain/credential/data/role";
import { IDatabase } from "./database";
import { IFeedbackQueryOptions } from "./feedback-database";
import { CredentialModel } from "./model/credential-model";
import { FeedbackModel } from "./model/feedback-model";
import { FeedbackSummaryModel } from "./model/feedback-summary-model";
import { JwRefreshTokenModel } from "./model/jw-refresh-token-model";
import { PagedModel } from "./model/paged-model";
import { TopicModel } from "./model/topic-model";
import { UserModel } from "./model/user-model";
import { CredentialEntity } from "./orm/credential.entity";
import { FeedbackEntity } from "./orm/feedback.entity";
import { JwRefreshTokenEntity } from "./orm/jw-refresh-token.entity";
import { TopicEntity } from "./orm/topic.entity";
import { UserEntity } from "./orm/user.entity";
import { ITopicQueryOptions } from "./topic-database";

export class DatabaseImpl implements IDatabase {
    constructor(private dataSource: DataSource, private createIdFn: () => Promise<string>) { }

    async createId(): Promise<string> {
        return await this.createIdFn();
    }

    get dateTime(): number {
        return Date.now();
    }

    async insertJwRefreshToken(token: JwRefreshTokenModel): Promise<void> {
        const repo = this.dataSource.getRepository(JwRefreshTokenEntity);
        const newData = repo.create(jwRefreshTokenModelToEntity(token));
        await repo.save(newData);
    }

    async insertAndUpdateRefreshToken(insert: JwRefreshTokenModel, update: JwRefreshTokenModel): Promise<void> {
        await this.dataSource.transaction(async (em) => {
            const repo = em.getRepository(JwRefreshTokenEntity);
            await repo.update({ id: update.id }, jwRefreshTokenModelToEntity(update));
            await repo.save(repo.create(jwRefreshTokenModelToEntity(insert)));
        });
    }

    async findJwRefreshTokenById(id: string): Promise<JwRefreshTokenModel | null> {
        const rawResult = await this.dataSource.getRepository(JwRefreshTokenEntity)
            .findOne({
                where: { id },
                relations: ["user"],
            });
        return jwRefreshTokenEntityToModel(rawResult) || null;
    }

    async updateJwRefreshToken(token: JwRefreshTokenModel): Promise<void> {
        await this.dataSource.getRepository(JwRefreshTokenEntity).update({ id: token.id }, jwRefreshTokenModelToEntity(token));
    }

    async findUserById(id: string): Promise<UserModel | null> {
        const repo = this.dataSource.getRepository(UserEntity);
        const rawResult = await repo.findOneBy({ id });
        return userEntityToModel(rawResult) || null;
    }

    async findCredentialByLogin(login: string): Promise<CredentialModel | null> {
        const repo = this.dataSource.getRepository(CredentialEntity);
        const rawResult = await repo.findOneBy({ login });
        return credentialEntityToModel(rawResult) || null;
    }

    async insertTopic(topic: TopicModel): Promise<void> {
        const repo = this.dataSource.getRepository(TopicEntity);
        const newData = repo.create(topicModelToEntity(topic));
        await repo.save(newData);
    }

    async updateTopic(topic: TopicModel): Promise<void> {
        const repo = this.dataSource.getRepository(TopicEntity);
        await repo.update({ id: topic.id }, topicModelToEntity(topic));
    }

    async removeTopicById(id: string): Promise<void> {
        const repo = this.dataSource.getRepository(TopicEntity);
        await repo.delete({ id });
    }

    async findTopicById(id: string): Promise<TopicModel | null> {
        const repo = this.dataSource.getRepository(TopicEntity);
        return topicEntityToModel(await repo.findOneBy({ id })) || null;
    }

    async findTopicByCode(code: string): Promise<TopicModel | null> {
        const repo = this.dataSource.getRepository(TopicEntity);
        return topicEntityToModel(await repo.findOneBy({ code })) || null;
    }

    async findTopicExistsByTitle(title: string): Promise<boolean> {
        const repo = this.dataSource.getRepository(TopicEntity);
        const many = await repo.find({
            select: ["lowerTitle"],
            where: { title: title.toLowerCase() }
        });
        return many.length !== 0;
    }

    async findTopicExistsByCode(code: string): Promise<boolean> {
        const repo = this.dataSource.getRepository(TopicEntity);
        const one = await repo.findOne({
            select: ["code"],
            where: { code }
        });
        return one !== null;
    }

    async findTopicPage(
        index: number, size: number, options?: ITopicQueryOptions
    ): Promise<PagedModel<TopicModel>> {
        const repo = this.dataSource.getRepository(TopicEntity);
        const title = `t.lowerTitle LIKE :title`;
        const description = `t.lowerDescription LIKE :description`;
        const whereParams = { 
            title: `%${options?.title?.toLowerCase() || ""}%`, 
            description: `%${options?.description?.toLowerCase() || ""}%` 
        };
        const many = await repo.createQueryBuilder("t")
            .where(`${title} OR ${description}`, whereParams)
            .limit(size)
            .offset((index - 1) * size)
            .orderBy("t.created", "DESC")
            .getMany();

        const count = await repo.createQueryBuilder("t")
            .where(`${title} OR ${description}`, whereParams)
            .getCount();

        return new PagedModel<TopicModel>(
            many.map(v => topicEntityToModelNotUndef(v)),
            size,
            index,
            Math.ceil(count / size),
        );
    }

    async insertFeedback(feedback: FeedbackModel): Promise<void> {
        const repo = this.dataSource.getRepository(FeedbackEntity);
        const newData = repo.create(feedbackModelToEntity(feedback));
        await repo.save(newData);
    }

    async findFeedbackById(id: string): Promise<FeedbackModel | null> {
        const repo = this.dataSource.getRepository(FeedbackEntity);
        return feedbackEntityToModel(await repo.findOneBy({ id })) || null;
    }

    async findFeedbackSummariesByTopicId(id: string): Promise<FeedbackSummaryModel[]> {
        const repo = this.dataSource.getRepository(FeedbackEntity);
        const many = await repo.createQueryBuilder("f")
            .select(["f.id", "f.rating"])
            .where("f.topicId=:id", { id })
            .getMany();
        return many.map(v => new FeedbackSummaryModel(v.id, v.rating));
    }

    async findFeedbackPage(
        topic: string, index: number, size: number, options?: IFeedbackQueryOptions
    ): Promise<PagedModel<FeedbackModel>> {
        const repo = this.dataSource.getRepository(FeedbackEntity);
        const id = `f.topicId=:id`;
        const reason = `f.lowerReason LIKE :reason`;
        const rating = `f.rating=:rating`;
        let qb = repo.createQueryBuilder("f");
        let countQb = repo.createQueryBuilder("f");
        let addOr = false;
        if (options?.reason !== undefined || options?.rating !== undefined) {
            if (options?.reason !== undefined) {
                const params = { reason: `%${options?.reason.toLowerCase() || ""}%` };
                qb = qb.where(`${reason}`, params);
                countQb = countQb.where(`${reason}`, params);
                addOr = true;
            }
            if (options?.rating !== undefined) {
                const params = { rating: options?.rating };
                qb = addOr ? qb.orWhere(rating, params) : qb.where(rating, params);
                countQb = addOr ? countQb.orWhere(rating, params) : countQb.where(rating, params);
                addOr = true;
            }
        }

        const params = { id: topic };
        qb = addOr ? qb.andWhere(id, params) : qb.where(id, params);
        countQb = addOr ? countQb.andWhere(id, params) : countQb.where(id, params);

        const many = await qb.limit(size)
            .offset((index - 1) * size)
            .orderBy("f.created", "DESC")
            .getMany();

        const count = await countQb.getCount();

        return new PagedModel<FeedbackModel>(
            many.map(v => feedbackEntityToModelNotUndef(v)),
            size,
            index,
            Math.ceil(count / size),
        );
    }


}

const jwRefreshTokenModelToEntity = (model: JwRefreshTokenModel) => {
    return {
        id: model.id,
        user: userModelToEntity(model.user),
        removed: model.removed,
        created: model.created,
        updated: model.updated,
    };
};

const userModelToEntity = (model: UserModel) =>
    model === UserModel.empty ? undefined : also(new UserEntity(), (obj) => {
        obj.id = model.id;
        obj.firstName = model.firstName;
        obj.lastName = model.lastName;
        obj.email = model.email;
        obj.created = model.created;
        obj.updated = model.updated;
    });

const jwRefreshTokenEntityToModel = (entity: JwRefreshTokenEntity | null) =>
    entity == null ? undefined : new JwRefreshTokenModel(
        entity.id,
        userEntityToModel(entity.user),
        entity.removed,
        entity.created,
        entity.updated,
    );

const userEntityToModel = (entity: UserEntity | null) => entity == null ? undefined : new UserModel(
    entity.id,
    entity.firstName,
    entity.lastName,
    entity.email,
    entity.created,
    entity.updated,
);

const credentialEntityToModel = (entity: CredentialEntity | null) =>
    entity == null ? undefined : new CredentialModel(
        entity.userId,
        entity.login,
        entity.password,
        roleEntityToModel(entity.role),
    );

const roleEntityToModel = (entity: number) => {
    const result: string[] = [];
    if ((entity & CredentialEntity.ROLE_ADMIN) !== 0) {
        result.push(Role[Role.admin]);
    }
    if (result.length === 0 && entity === 0) {
        result.push(Role[Role.anonymous]);
    }
    if (result.length === 0 && entity !== 0) {
        throw new Error("unexpected role value");
    }
    return result;
};

const topicModelToEntity = (model: TopicModel) => {
    const result = new TopicEntity();
    result.id = model.id;
    result.code = model.code;
    result.title = model.title;
    result.lowerTitle = model.title.toLowerCase();
    result.description = model.description;
    result.lowerDescription = model.description.toLowerCase();
    result.author = model.author;
    result.authorName = model.authorName;
    result.expires = model.expires;
    result.created = model.created;
    result.updated = model.updated;
    return result;
}

const topicEntityToModel = (entity: TopicEntity | null) =>
    entity == null ? undefined : topicEntityToModelNotUndef(entity);

const topicEntityToModelNotUndef = (entity: TopicEntity) =>
    new TopicModel(
        entity.id,
        entity.code,
        entity.title,
        entity.description,
        entity.author,
        entity.authorName,
        entity.expires,
        entity.created,
        entity.updated,
    );

const feedbackModelToEntity = (model: FeedbackModel) => {
    const result = new FeedbackEntity();
    result.id = model.id;
    result.topicId = model.topic;
    result.rating = model.rating;
    result.reason = model.reason;
    result.lowerReason = model.reason.toLowerCase();
    result.created = model.created;
    return result;
};

const feedbackEntityToModel = (entity: FeedbackEntity | null) =>
    entity == null ? undefined : feedbackEntityToModelNotUndef(entity);

const feedbackEntityToModelNotUndef = (entity: FeedbackEntity) =>
    new FeedbackModel(
        entity.id,
        entity.topicId,
        entity.rating,
        entity.reason,
        entity.created,
    )