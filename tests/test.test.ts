import { mock, when, verify, instance, anything } from 'ts-mockito';
import { reject } from '../tests-config/config';

class ItemResponse {
    constructor(
        public readonly id: string,
        public readonly description: string,
        public readonly price: number,
    ) { }
}

class HeaderResponse {
    constructor(
        readonly id: string = "",
        readonly items: ItemResponse[] = [],
    ) { }

    get total(): number {
        return this.items.map((v) => v.price).reduce((p, c) => (p || 0) + c);
    }
}

interface IApi {
    findHeaderById(id: string): Promise<HeaderResponse>;
    findHeaders(): Promise<HeaderResponse[]>;
}

class HeaderRepository {
    constructor(private api: IApi) { }

    async findById(id: string): Promise<HeaderResponse> {
        return await this.api.findHeaderById(id);
    }

    async findAll(): Promise<HeaderResponse[]> {
        return await this.api.findHeaders();
    }
}

class ApiFixture {
    static items1 = [
        new ItemResponse("a", "b", 1),
        new ItemResponse("c", "d", 2),
        new ItemResponse("e", "f", 3),
    ];

    static items2 = [
        new ItemResponse("g", "h", 4),
        new ItemResponse("i", "j", 5),
    ];

    static headers = [
        new HeaderResponse("a", ApiFixture.items1),
        new HeaderResponse("b", ApiFixture.items2),
    ]
};

describe('Mockito tests', () => {
    let api: IApi;
    let repository: HeaderRepository;

    beforeEach(() => {
        api = mock<IApi>();

        when(api.findHeaderById("a")).thenResolve(ApiFixture.headers[0]);
        when(api.findHeaderById("b")).thenReject(new Error('rejected'));
        when(api.findHeaders()).thenResolve(ApiFixture.headers);

        repository = new HeaderRepository(instance(api));
    });

    test('should find a header', async () => {
        const header = await repository.findById("a");
        verify(api.findHeaderById("a")).once();
        verify(api.findHeaders()).never();
        expect(header).toEqual({ ...ApiFixture.headers[0] });
    });

    reject('shouldn\'t find headers', async () => {
        await repository.findById("b");
    }, (err) => {
        expect(err.message).toEqual('rejected');
        verify(api.findHeaderById("b")).once();
        verify(api.findHeaders()).never();
    });

    test('should find headers', async () => {
        const headers = await repository.findAll();
        verify(api.findHeaderById(anything())).never();
        verify(api.findHeaders()).once();
        expect(headers).toEqual([...ApiFixture.headers]);
    });

    reject('shouldn\'t find headers', async () => {
        when(api.findHeaders()).thenReject(new Error('rejected'));
        await repository.findAll();
    }, (err) => {
        expect(err.message).toEqual('rejected');
        verify(api.findHeaderById(anything())).never();
        verify(api.findHeaders()).once();
    });
});
