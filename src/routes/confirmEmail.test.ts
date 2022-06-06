import { User } from '../entity/User';
import { redis } from '../redis';
import server from '../server';
import { TestDataSource } from '../data-source';
import fetch from 'cross-fetch';
import { confirmEmailLink } from '../utils/confirmEmailLink';


const email = 'user@mail.com';
const password = 'smartPass';
let endpoint: string;
let userId: string;
const testDataSource = TestDataSource;

beforeAll(async () => {
    const serverInfo = await server();
    endpoint = `${serverInfo.url}`;

    const user = await User.create({ email, password }).save();
    userId = user.id;
});

afterAll(async () => {
    testDataSource.destroy();
    redis.disconnect();
});

describe('Confirm email link works', () => {
    test('Test that it confirms user and deletes key in redis', async () => {
        const confirmationUrl = await confirmEmailLink(endpoint, userId as string, redis);
        const response = await fetch(confirmationUrl);
        const text = await response.text();
    
        expect(text).toBe('Email confirmed!');
    
        const key = confirmationUrl.split('/').pop();
        const value = await redis.get(key as KeyType);
        expect(value).toBeNull();
    });

    test('Test for invalid if id is resent', async () => {
        const confirmationUrl = await confirmEmailLink(endpoint, userId as string, redis);
        const response = await fetch(confirmationUrl);
        const text = await response.text();
    
        expect(text).toBe('Invalid');
    });
});