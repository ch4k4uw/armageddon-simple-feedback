import { CryptoConfigProviderImpl } from "../../../../src/infra/credential/service/crypto-config-provider-impl";
import { ICryptoService } from "../../../../src/infra/credential/service/crypto-service";
import { CryptoServiceImpl } from "../../../../src/infra/credential/service/crypto-service-impl";

const fixture = {
    plain: "War machine destroys everything 2022",
    text: "AAAQAAAYTcNp19NYW0VIsPGW2uUP63Z2J4Tp1H1/JGh1plvg/0fNiUqdty2HJw==",
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
});