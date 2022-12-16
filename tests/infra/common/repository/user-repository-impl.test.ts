import { anyString, instance, mock, verify, when } from "ts-mockito";
import { User } from "../../../../src/domain/common/entity/user";
import { IUserRepository } from "../../../../src/domain/common/repository/user-repository";
import { UserRepositoryImpl } from "../../../../src/infra/common/repository/user-repository-impl";
import { UserModel } from "../../../../src/infra/database/model/user-model";
import { IUserDatabase } from "../../../../src/infra/database/user-database";

const fixture = {
    success: {
        id: "success",
        results: {
            user: new UserModel("a1", "b1", "c1", "d1", Date.now(), Date.now()),
            expected: function() {
                return this.user.asDomain;
            }
        }
    },
    notFound: {
        id: "not-found",
        results: {
            user: new UserModel("a2", "b2", "c2", "d2", Date.now(), Date.now()),
        }
    }
};

describe('User repository tests', () => {
    let repo: IUserRepository;
    let database: IUserDatabase;

    beforeEach(() => {
        database = mock<IUserDatabase>();

        when(database.findUserById(fixture.success.id))
            .thenResolve(fixture.success.results.user);
        when(database.findUserById(fixture.notFound.id))
            .thenCall(async () => null);

        repo = new UserRepositoryImpl(instance(database));
    });

    test('should find an user', async () => {
        const result = await repo.findById(fixture.success.id);

        expect(result).toEqual({ ...fixture.success.results.expected() });
        verify(database.findUserById(anyString())).once();

    });

    test('shouldn\'t find an user', async () => {
        const result = await repo.findById(fixture.notFound.id);

        expect(result).toEqual(User.empty);
        verify(database.findUserById(anyString())).once();
    });
});