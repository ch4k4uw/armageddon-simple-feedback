import { DataSource, Repository } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { UserEntity } from "../user.entity";

export class UserSeeder implements Seeder {
    async run(dataSource: DataSource, _factoryManager: SeederFactoryManager): Promise<void> {
        const repo = dataSource.getRepository(UserEntity);
        const now = Date.now();
        const user1 = {
            id: "56b78b70-1c8e-4c13-8f5a-5959dd7f5865",
            firstName: "Pedro",
            lastName: "Motta",
            email: "garra.e@gmail.com",
            created: now,
            updated: now,
        };

        const user2 = {
            id: "6559b777-8587-47b3-bdba-b60519acaf51",
            firstName: "Guest",
            lastName: "",
            email: "guest@armageddon.com",
            created: now,
            updated: now,
        };

        await this.insertData(user1, repo);
        await this.insertData(user2, repo);
    }

    private async insertData(data: any, repo: Repository<UserEntity>) {
        const existent = await repo.findOneBy({ id: data.id });
        if (!existent) {
            const newData = repo.create(data);
            await repo.save(newData);
        }
    }

}