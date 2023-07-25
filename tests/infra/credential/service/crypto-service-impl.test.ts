import { CryptoConfigProviderImpl } from "../../../../src/infra/credential/service/crypto-config-provider-impl";
import { ICryptoService } from "../../../../src/infra/credential/service/crypto-service";
import { CryptoServiceImpl } from "../../../../src/infra/credential/service/crypto-service-impl";

const fixture = {
    plain: "War machine destroys everything 2022",
    text: "AAAQAAAYTcNp19NYW0VIsPGW2uUP63Z2J4Tp1H1/JGh1plvg/0fNiUqdty2HJw==",
    password: "123456",
    decrypted: "xyz",
    encrypted: "AAAQAAAQDoAPBUl0RUvnU1SSDgdJJJB80HLnHPiCN3/wcnteC7E=", 
};

describe('Crypto service tests', () => {
    let svc: ICryptoService;

    beforeEach(() => {
        svc = new CryptoServiceImpl(new CryptoConfigProviderImpl());
    });

    test('should hash a text', async () => {
        const result = await svc.hash(fixture.plain);
        expect(result).not.toEqual("");
    });

    test('should return true on text comparison', async () => {
        const result = await svc.compare(fixture.plain, fixture.text);
        expect(result).toEqual(true);
    });

    test('should return false on text comparison', async () => {
        const result = await svc.compare(fixture.plain + " - invalid", fixture.text);
        expect(result).toEqual(false);
    });

    test('should encrypt data with a password', async () => {
        const result = await svc.encrypt(fixture.password, fixture.decrypted);
        const revResult = await svc.decrypt(fixture.password, result);
        expect(revResult).toEqual(fixture.decrypted);
    });

    test('shouldn\'t decrypt data', async () => {
        const revResult = svc.decrypt(fixture.password + "xxx", fixture.encrypted);
        await expect(revResult).rejects.toThrowError();
    });
});