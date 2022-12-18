import { INanoIdService } from "../../../../src/infra/feedback/service/nano-id-service";
import { NanoIdServiceImpl } from "../../../../src/infra/feedback/service/nano-id-service-impl";

describe('Nano id tests', () => {
    let svc: INanoIdService;
    beforeEach(() => {
        svc = new NanoIdServiceImpl();
    })

    test('should create a nano id', async () => {
        const nanoIdLen = +(process.env.ARMAGEDDON_NANOID_LEN as string) || -1;
        const result = await svc.createId();

        expect(nanoIdLen).not.toEqual(-1);
        expect(result.length).toEqual(nanoIdLen);
    });

    test('should create different nano ids', async () => {
        let result = await svc.createId();
        expect(result).not.toEqual(await svc.createId());
    });
});