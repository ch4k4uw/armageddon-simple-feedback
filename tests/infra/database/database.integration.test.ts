import { DataSource, DataSourceOptions } from "typeorm";
import { runSeeder, SeederOptions } from "typeorm-extension";
import { IDatabase } from "../../../src/infra/database/database";
import { DefaultSeeder } from "../../../src/infra/database/orm/seeds/default-seeder";
import { UserEntity } from "../../../src/infra/database/orm/user.entity";
import { root } from "../../../src/root-path";
import * as Uuid from "uuid";
import { DatabaseImpl } from "../../../src/infra/database/database-impl";
import { CredentialEntity } from "../../../src/infra/database/orm/credential.entity";
import { TopicEntity } from "../../../src/infra/database/orm/topic.entity";
import { FeedbackEntity } from "../../../src/infra/database/orm/feedback.entity";
import { JwRefreshTokenEntity } from "../../../src/infra/database/orm/jw-refresh-token.entity";

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
    let dataSource: DataSource;
    let createIdFn: (() => Promise<string>);
    let db: IDatabase;
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

    test('Should perform database interactions', async () => {
        const user = await db.findUserById("56b78b70-1c8e-4c13-8f5a-5959dd7f5865");
        console.log(user);
    });
});