import * as dotenv from "dotenv";
import { date } from "joi";
import { DataSource, Repository } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { CredentialEntity } from "../credential.entity";

if (process.env.NODE_ENV !== 'test') {
    dotenv.config();
}

export class CredentialSeeder implements Seeder {
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        const repo = dataSource.getRepository(CredentialEntity);

        const data1 = {
            userId: "56b78b70-1c8e-4c13-8f5a-5959dd7f5865",
            login: "root",
            password: process.env.ARMAGEDDON_SEED_USER_PASS,
            role: CredentialEntity.ROLE_ADMIN
        };

        const data2 = {
            userId: "6559b777-8587-47b3-bdba-b60519acaf51",
            login: "guest",
            password: process.env.ARMAGEDDON_SEED_GUEST_USER_PASS,
            role: CredentialEntity.ROLE_GUEST
        };

        await this.insertData(data1, repo);
        await this.insertData(data2, repo);
    }

    private async insertData(data: any, repo: Repository<CredentialEntity>) {
        const existent = await repo.findOneBy({ userId: data.userId });
        if (!existent) {
            const newData = repo.create(data);
            await repo.save(newData);
        }
    }
}