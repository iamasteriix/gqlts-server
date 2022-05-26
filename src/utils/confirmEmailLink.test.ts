import { User } from '../entity/User';
import Redis = require('ioredis');
import { confirmEmailLink } from './confirmEmailLink';
import { TestDataSource } from '../data-source';


const redis = new Redis();
const endpoint = `http://localhost:4000`;
const email = 'user@mail.com';
const password = 'smartPass';
let userId: string;

beforeAll(async () => {
    await TestDataSource.initialize();
    const user = await User.create({ email, password }).save();
    userId = user.id;
});

afterAll(() => {
    redis.disconnect();
});

test('Confirm email link works', async () => {
    const confirmationUrl = await confirmEmailLink(endpoint, userId as string, redis);

    // not sure how else I would test for this link,
    // so I'll print it on the console so the 
    // tester can just look at it, I guess
    console.log(confirmationUrl);
});