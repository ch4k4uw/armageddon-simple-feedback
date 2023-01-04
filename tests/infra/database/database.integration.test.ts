import { DataSource, DataSourceOptions } from "typeorm";
import { runSeeder, SeederOptions } from "typeorm-extension";
import * as Uuid from "uuid";
import { also } from "../../../src/domain/common/service/also";
import { IDatabase } from "../../../src/infra/database/database";
import { DatabaseImpl } from "../../../src/infra/database/database-impl";
import { FeedbackModel } from "../../../src/infra/database/model/feedback-model";
import { JwRefreshTokenModel } from "../../../src/infra/database/model/jw-refresh-token-model";
import { TopicModel } from "../../../src/infra/database/model/topic-model";
import { UserModel } from "../../../src/infra/database/model/user-model";
import { DefaultSeeder } from "../../../src/infra/database/orm/seeds/default-seeder";

const dsOptions: DataSourceOptions & SeederOptions = {
    type: "sqlite",
    database: `:memory:`,
    logging: true,
    entities: [`${__dirname}/../../../src/infra/database/orm/*.entity.@(ts|js)`],
    migrations: [`${__dirname}/../../../src/infra/database/orm/migrations/*.@(ts|js)`],
    seeds: [DefaultSeeder],
    logger: "debug"
};

const appDataSource = new DataSource(dsOptions);

describe('Databas integration test', () => {
    const topicCount = 57;
    let dataSource: DataSource;
    let createIdFn: (() => Promise<string>);
    let db: IDatabase;

    jest.setTimeout(50000);

    beforeEach(async () => {
        dataSource = await appDataSource.initialize();
        await dataSource.runMigrations();
        
        await runSeeder(dataSource, DefaultSeeder);

        createIdFn = async () => Uuid.v4();

        db = new DatabaseImpl(dataSource, createIdFn);
    });

    afterEach(async () => {
        await dataSource.destroy();
    });

    test('should perform CRU operations over jw-refresh-token', async () => {
        const user = await db.findUserById("56b78b70-1c8e-4c13-8f5a-5959dd7f5865");
        const jwRefreshTokenModel1 = new JwRefreshTokenModel(
            await db.createId(),
            new UserModel(user?.id, user?.firstName, user?.lastName, user?.email, user?.created, user?.updated),
            false,
            Date.now(),
            Date.now(),
        );

        await db.insertJwRefreshToken(jwRefreshTokenModel1);

        let jwRefreshTokenModel2 = await db.findJwRefreshTokenById(jwRefreshTokenModel1.id);

        expect({ ...jwRefreshTokenModel1 }).toEqual({ ...jwRefreshTokenModel2 });

        let jwRefreshTokenModel3: JwRefreshTokenModel | null = new JwRefreshTokenModel(
            await db.createId(),
            jwRefreshTokenModel2?.user,
            false,
            Date.now(),
            Date.now(),
        );

        jwRefreshTokenModel2 = new JwRefreshTokenModel(
            jwRefreshTokenModel2?.id,
            jwRefreshTokenModel2?.user,
            true,
            jwRefreshTokenModel2?.created,
            Date.now(),
        );

        await db.insertAndUpdateRefreshToken(jwRefreshTokenModel3, jwRefreshTokenModel2);

        jwRefreshTokenModel2 = await db.findJwRefreshTokenById(jwRefreshTokenModel2.id);
        jwRefreshTokenModel3 = await db.findJwRefreshTokenById(jwRefreshTokenModel3.id);

        expect(jwRefreshTokenModel2).not.toBeNull();
        expect(jwRefreshTokenModel3).not.toBeNull();
        expect(jwRefreshTokenModel2?.removed).toEqual(true);
        expect(jwRefreshTokenModel3?.removed).toEqual(false);

        jwRefreshTokenModel3 = new JwRefreshTokenModel(
            jwRefreshTokenModel3?.id,
            jwRefreshTokenModel3?.user,
            true,
            jwRefreshTokenModel3?.created,
            Date.now(),
        );

        db.updateJwRefreshToken(jwRefreshTokenModel3);

        jwRefreshTokenModel3 = await db.findJwRefreshTokenById(jwRefreshTokenModel3.id);

        expect(jwRefreshTokenModel3?.removed).toEqual(true);

    });

    test('should find the seed user', async () => {
        const user = await db.findUserById("56b78b70-1c8e-4c13-8f5a-5959dd7f5865");
        expect(user).not.toBeNull();
    });

    test('should find the seed user credential', async () => {
        const credential = await db.findCredentialByLogin("root");

        expect(credential).not.toBeNull();
        expect(credential?.password).toEqual(process.env.ARMAGEDDON_SEED_USER_PASS);
        expect(credential?.user).toEqual("56b78b70-1c8e-4c13-8f5a-5959dd7f5865");
    });

    test('should perform CRUD operations over topic', async () => {
        await seedTopicAndFeedback(topicCount);

        let currTopicIndex = 1;
        let currTopicSize = 10;
        let topicPage = await db.findTopicPage(currTopicIndex, currTopicSize);

        expect(topicPage.index).toEqual(currTopicIndex);
        expect(topicPage.size).toEqual(currTopicSize);
        expect(topicPage.total).toEqual(6);
        expect(topicPage.result.length).toEqual(currTopicSize);
        expect(topicPage.result[0].created).toBeGreaterThan(topicPage.result[1].created);

        currTopicIndex = 6;
        topicPage = await db.findTopicPage(currTopicIndex, currTopicSize);

        expect(topicPage.index).toEqual(currTopicIndex);
        expect(topicPage.size).toEqual(currTopicSize);
        expect(topicPage.total).toEqual(6);
        expect(topicPage.result.length).toEqual(topicCount % currTopicSize);

        let topic: TopicModel | null = topicPage.result[0];

        topic = await db.findTopicById(topic.id);

        expect(topic).not.toBeNull();
        
        topic = await db.findTopicByCode(topic?.code || "");

        expect(topic).not.toBeNull();

        expect(await db.findTopicExistsByTitle(topic?.title?.toUpperCase() || "")).toEqual(true);
        expect(await db.findTopicExistsByTitle(topic?.title?.toUpperCase() || "", topic?.id)).toEqual(false);
        expect(await db.findTopicExistsByTitle((topic?.title || "") + "###")).toEqual(false);
        expect(await db.findTopicExistsByCode(topic?.code || "")).toEqual(true);
        expect(await db.findTopicExistsByCode((topic?.code || "") + "###")).toEqual(false);

        topic = new TopicModel(
            topic?.id,
            topic?.code,
            "This is a test",
            topic?.description,
            topic?.author,
            topic?.authorName,
            topic?.expires,
            topic?.created,
            topic?.updated,
        );

        await db.updateTopic(topic);

        topic = await db.findTopicById(topic.id);

        expect(topic).not.toBeNull();
        expect(topic?.title).toEqual("This is a test");

        await db.removeTopicById(topic?.id || "");

        topicPage = await db.findTopicPage(currTopicIndex, currTopicSize);

        expect(topicPage.total).toEqual(6);
        expect(topicPage.result.length).toEqual((topicCount % currTopicSize) - 1);

        function updateTopicTitle(topic: TopicModel | null, newTitle: string) {
            return new TopicModel(
                topic?.id,
                topic?.code,
                newTitle,
                topic?.description,
                topic?.author,
                topic?.authorName,
                topic?.expires,
                topic?.created,
                topic?.updated,
            )
        }

        function updateTopicDescription(topic: TopicModel | null, newDescription: string) {
            return new TopicModel(
                topic?.id,
                topic?.code,
                topic?.title,
                newDescription,
                topic?.author,
                topic?.authorName,
                topic?.expires,
                topic?.created,
                topic?.updated,
            )
        }

        --currTopicIndex;
        topicPage = await db.findTopicPage(currTopicIndex, currTopicSize);

        await db.updateTopic(updateTopicTitle(topicPage.result[0], "This is a test"));
        await db.updateTopic(updateTopicTitle(topicPage.result[1], "Is this a test?"));
        await db.updateTopic(updateTopicTitle(topicPage.result[2], "I think this is a test"));
        await db.updateTopic(updateTopicDescription(topicPage.result[3], "How about this description?"));

        currTopicIndex = 1;
        topicPage = await db.findTopicPage(currTopicIndex, currTopicSize, { title: "IS", description: "Abou" });

        expect(topicPage.index).toEqual(currTopicIndex);
        expect(topicPage.size).toEqual(currTopicSize);
        expect(topicPage.total).toEqual(1);
        expect(topicPage.result.length).toEqual(4);

    });

    test('should perform CR operations over feedback', async () => {
        await seedTopicAndFeedback(topicCount);

        let currTopicIndex = 1;
        let currTopicSize = 10;
        let topicPage = await db.findTopicPage(currTopicIndex, currTopicSize);

        let currFeedbackIndex = 1;
        let currFeedbackSize = 10;
        let feedbackPage = await db.findFeedbackPage(
            topicPage.result[0].id, currFeedbackIndex, currFeedbackSize
        );

        expect(feedbackPage.index).toEqual(currFeedbackIndex);
        expect(feedbackPage.size).toEqual(currFeedbackSize);
        expect(feedbackPage.result.length).toEqual(currFeedbackSize);
        expect(feedbackPage.result[0].created).toBeGreaterThan(feedbackPage.result[1].created);

        currFeedbackIndex = feedbackPage.total;
        feedbackPage = await db.findFeedbackPage(
            topicPage.result[0].id, currFeedbackIndex, currFeedbackSize
        );

        let summary = await db.findFeedbackSummariesByTopicId(topicPage.result[0].id);

        expect(feedbackPage.result.length).toEqual(summary.length % currFeedbackSize);

        currFeedbackIndex = 1;
        feedbackPage = await db.findFeedbackPage(
            topicPage.result[0].id, currFeedbackIndex, currFeedbackSize
        );

        expect(await db.findFeedbackById(summary[0].id)).not.toBeNull();

    });

    async function seedTopicAndFeedback(topicCount: number) {
        const dataModels = await generateDataModels(topicCount);

        for (let data of dataModels) {
            const topic = data.topic;
            const feedback = data.feedback;
            await db.insertTopic(topic);
            for (let feedbackItem of feedback) {
                await db.insertFeedback(feedbackItem);
            };
        }
    }

    async function generateDataModels(
        n: number
    ): Promise<Array<{topic: TopicModel, feedback: FeedbackModel[]}>> {
        const result: Array<{topic: TopicModel, feedback: FeedbackModel[]}> = [];
        let nextFeedbackSuffix = 1;

        const now = Date.now();

        for(let i=0; i<n; ++i) {
            const currFeedbackSiffix = nextFeedbackSuffix;
            const feedbackCount = Math.floor((Math.random() * 44) + 13);
            nextFeedbackSuffix += feedbackCount + 1;

            const topic = new TopicModel(
                await db.createId(),
                `tpc.code${i+1}`,
                `Tpc.Title${i+1}`,
                `Tpc.Desc${i+1}`,
                `tpc.author${i+1}`,
                `tpc.authorName${i+1}`,
                also(new Date(now), (d) => {
                    d.setDate(d.getDate() + 10);
                }).getTime(),
                now + (i * 1000 * 60 * 60),
                now + (i * 1000 * 60 * 60),
            );

            const feedback = await generateFeedbackModels(topic.id, feedbackCount, currFeedbackSiffix);

            result.push({topic, feedback});
        }

        return result;
    }

    async function generateFeedbackModels(topic: string, n: number, suffix: number) {
        const result: FeedbackModel[] = [];
        const now = Date.now();

        for(let i=1; i<=n; ++i) {
            result.push(
                new FeedbackModel(
                    await db.createId(),
                    topic,
                    Math.floor((Math.random() * 4) + 1),
                    `fb.reason${suffix+i}`,
                    now + ((i-1) * 1000 * 60 * 60)
                )
            );
        }
        return result;
    }
});