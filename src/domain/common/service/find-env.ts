export function findEnvOrThrow(env: string) {
    const envValue = process.env[env] as string | undefined;
    if (!envValue) {
        throw new Error(`${env} must be defined.`);
    }
    return envValue;
}