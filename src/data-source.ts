import "reflect-metadata";
import { DataSource } from "typeorm";
import { root } from "./root-path";

export const appDataSource = new DataSource({
    type: "sqlite",
    database: `${root}/data/db.sqlite`,
    logging: true,
    entities: [`${__dirname}/infra/database/orm/*.entity.@(ts|js)`],
    migrations: [`${__dirname}/infra/database/orm/migrations/*.@(ts|js)`],
});