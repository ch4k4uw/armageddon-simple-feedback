import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import { DefaultSeeder } from "./infra/database/orm/seeds/default-seeder";
import { root } from "./root-path";

const dsOptions: DataSourceOptions & SeederOptions = {
    type: "sqlite",
    database: `${root}/data/db.sqlite`,
    logging: true,
    entities: [`${__dirname}/infra/database/orm/*.entity.@(ts|js)`],
    migrations: [`${__dirname}/infra/database/orm/migrations/*.@(ts|js)`],
    seeds: [DefaultSeeder],
    logger: "debug"
};

export const appDataSource = new DataSource(dsOptions);