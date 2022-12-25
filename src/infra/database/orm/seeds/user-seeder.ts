import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { UserEntity } from "../user.entity";

export class UserSeeder implements Seeder {
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        const repo = dataSource.getRepository(UserEntity);
        const now = Date.now();
        const data = {
            id: "56b78b70-1c8e-4c13-8f5a-5959dd7f5865",
            firstName: "Pedro",
            lastName: "Motta",
            email: "garra.e@hotmail.com",
            created: now,
            updated: now,
        };

        const existent = await repo.findOneBy({ id: data.id });
        if (!existent) {
            const newData = repo.create(data);
            await repo.save(newData);
        }
    }

}