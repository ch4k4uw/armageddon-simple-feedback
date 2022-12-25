import { DataSource } from "typeorm";
import { runSeeder, Seeder, SeederFactoryManager } from "typeorm-extension";
import { CredentialSeeder } from "./credential-seeder";
import { UserSeeder } from "./user-seeder";

export class DefaultSeeder implements Seeder {
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        await runSeeder(dataSource, UserSeeder);
        await runSeeder(dataSource, CredentialSeeder);
    }
}