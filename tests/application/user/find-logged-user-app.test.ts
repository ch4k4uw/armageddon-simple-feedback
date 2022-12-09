import { anything, instance, mock, verify, when } from "ts-mockito";
import { FindLoggedUserApp } from "../../../src/application/user/find-logged-user-app";
import { UserNotFoundError } from "../../../src/domain/common/data/user-not-found-error";
import { User } from "../../../src/domain/common/entity/user";
import { IUserRepository } from "../../../src/domain/common/repository/user-repository";
import { ExpiredAccessTokenError } from "../../../src/domain/token/data/expired-access-token-error";
import { InvalidAccessTokenError } from "../../../src/domain/token/data/invalid-access-token-error";
import { reject } from "../../util/framework";
import { UserFixture } from "./stuff/user-fixture";

describe('Find user tests', () => {
    let svc: FindLoggedUserApp;
    let userRepository: IUserRepository;
    beforeEach(() => {
        userRepository = mock<IUserRepository>();

        setupUserRepository();

        svc = new FindLoggedUserApp(instance(userRepository));
    });

    function setupUserRepository() {
        when(userRepository.findById(UserFixture.FindLogged.successJwToken.loggedUser.id))
            .thenResolve(UserFixture.FindLogged.successUser);
        when(userRepository.findById(UserFixture.FindLogged.userNotFoundJwToken.loggedUser.id))
            .thenResolve(User.empty);
    }

    test('should find the logged user', async () => {
        const result = await svc.find(UserFixture.FindLogged.successJwToken);
        verify(userRepository.findById(anything())).once();
        expect(result).toEqual({ ...UserFixture.FindLogged.successUser });
    });

    reject('should reject with user not found', async () => { 
        await svc.find(UserFixture.FindLogged.userNotFoundJwToken);
    }, (err) => { 
        expect(err).toBeInstanceOf(UserNotFoundError);
        verify(userRepository.findById(anything())).once();
    });

    reject('should reject with invalid token', async () => { 
        await svc.find(UserFixture.FindLogged.invalidAccessToken);
    }, (err) => { 
        expect(err).toBeInstanceOf(InvalidAccessTokenError);
        verify(userRepository.findById(anything())).never();
    });

    reject('should reject with expired token', async () => { 
        await svc.find(UserFixture.FindLogged.expiredAccessToken);
    }, (err) => { 
        expect(err).toBeInstanceOf(ExpiredAccessTokenError);
        verify(userRepository.findById(anything())).never();
    });
});