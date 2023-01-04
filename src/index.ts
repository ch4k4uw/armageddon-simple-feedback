import * as dotenv from "dotenv";
import "reflect-metadata";
import Container from "typedi";
import { runSeeder } from "typeorm-extension";
import { appDataSource } from "./data-source";
import { DefaultSeeder } from "./infra/database/orm/seeds/default-seeder";
import { IoC } from "./ioc/ioc";
import { ExpressApp } from "./server/express-app";

if (process.env.NODE_ENV !== 'test') {
    dotenv.config();
}

async function runApp() {
    console.log("Starting database...");
    const dataSource = await appDataSource.initialize();
    console.log("Database started.");
    console.log("Running migrations...");
    await dataSource.runMigrations();
    console.log("OK.");
    console.log("Running seeders...");
    await runSeeder(dataSource, DefaultSeeder);
    console.log("OK.\nDatabase successfuly initialized.\n");
    
    IoC.registerDomainServices(dataSource);

    const app = Container.get(ExpressApp);
    app.listen();
}

runApp()
    .then(() => {
    })
    .catch(err => {
        console.error(err || "app: fatal error");
        console.log("\nApp finished with falar error.")
    });
