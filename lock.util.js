export const acquireLock = async (client, key, token, ttl) => {
    const result = await client.set(key, token, { NX: true, PX: ttl });
    return result === 'OK';
};
export const releaseLock = async (client, key, token) => {
    const value = await client.get(key);
    if (value === token) {
        await client.del(key);
    }
};