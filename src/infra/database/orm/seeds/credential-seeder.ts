import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { CredentialEntity } from "../credential.entity";

if (process.env.NODE_ENV !== 'test') {
    dotenv.config();
}

export class CredentialSeeder implements Seeder {
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        const repo = dataSource.getRepository(CredentialEntity);

        const data = {
            userId: "56b78b70-1c8e-4c13-8f5a-5959dd7f5865",
            login: "root",
            password: process.env.ARMAGEDDON_SEED_USER_PASS,
            role: CredentialEntity.ROLE_ADMIN
        };

        const existent = await repo.findOneBy({ userId: data.userId });
        if (!existent) {
            const newData = repo.create(data);
            await repo.save(newData);
        }
    }
}