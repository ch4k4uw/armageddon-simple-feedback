beforeEach(() => {
    process.env = { 
        ...process.env,
        ARMAGEDDON_ACCESS_TOKEN_SECRET: 'access-token-secret',
        ARMAGEDDON_REFRESH_TOKEN_SECRET: 'refresh-token-secret',
        ARMAGEDDON_ACCESS_TOKEN_ALGORITHM: 'HS256',
        ARMAGEDDON_REFRESH_TOKEN_ALGORITHM: 'HS512',
        ARMAGEDDON_ACCESS_TOKEN_EXPIRATION: '30m',
        ARMAGEDDON_REFRESH_TOKEN_EXPIRATION: '7 days',
    }
});