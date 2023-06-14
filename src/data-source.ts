import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import { DefaultSeeder } from "./infra/database/orm/seeds/default-seeder";
import { root } from "./root-path";

const dbPath = process.env.ARMAGEDDON_DB_PATH || `${root}/data/db.sqlite`;

const dsOptions: DataSourceOptions & SeederOptions = {
    type: "sqlite",
    database: dbPath,
    logging: true,
    entities: [`${__dirname}/infra/database/orm/*.entity.@(ts|js)`],
    migrations: [`${__dirname}/infra/database/orm/migrations/*.@(ts|js)`],
    seeds: [DefaultSeeder],
    logger: "debug"
};

export const appDataSource = new DataSource(dsOptions);