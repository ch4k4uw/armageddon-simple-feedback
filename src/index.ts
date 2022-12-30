import * as dotenv from "dotenv";
import "reflect-metadata";
import { runSeeder } from "typeorm-extension";
import { appDataSource } from "./data-source";
import { DefaultSeeder } from "./infra/database/orm/seeds/default-seeder";
import { IoC } from "./ioc/ioc";

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
    
    IoC.registerServices(dataSource);
}

runApp()
    .then(() => { 
        console.log("App finished.")
    })
    .catch(err => {
        console.error(err || "app: fatal error");
        console.log("\nApp finished with falar error.")
    });
