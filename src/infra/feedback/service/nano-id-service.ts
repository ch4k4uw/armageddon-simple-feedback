export interface INanoIdService {
    createId(): Promise<string>;
}