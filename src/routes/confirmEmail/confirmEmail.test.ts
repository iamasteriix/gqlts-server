import { User } from '../../entity/User';
import { redis } from '../../redis';
import server from '../../server';
import fetch from 'cross-fetch';
import { confirmEmailLink } from '../../utils/createConfirmEmailLink';


const email = 'user@mail.com';
const password = 'smartPass';
let endpoint: string;
let userId: string;
let confirmationUrl: string;

beforeAll(async () => {
    const serverInfo = await server();
    endpoint = `${serverInfo.url}`;

    const user = await User.create({ email, password }).save();
    userId = user.id;
    confirmationUrl = await confirmEmailLink(endpoint, userId, redis);
});

afterAll(async () => {
    redis.disconnect();
});

describe('Confirm email link works', () => {
    test('Test that it confirms user and deletes key in redis', async () => {
        const response = await fetch(confirmationUrl);
        const text = await response.text();
    
        expect(text).toBe('Email confirmed!');
    
        const key = confirmationUrl.split('/').pop();
        const value = await redis.get(key as KeyType);
        expect(value).toBeNull();
    });

    test('Test that user confirms email and is updated in the database', async () => {
       const user = await User.findOne({ where: { id: userId } });
       expect((user as User).confirmed).toBe(true);
    });

    test('Test for invalid if id is resent', async () => {
        const response = await fetch(confirmationUrl);
        const text = await response.text();
    
        expect(text).toBe('Invalid');
    });
});