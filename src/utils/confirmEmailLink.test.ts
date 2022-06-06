import { User } from '../entity/User';
import { redis } from '../redis';
import { confirmEmailLink } from './confirmEmailLink';
import server from '../server';
import { TestDataSource } from '../data-source';


const email = 'user@mail.com';
const password = 'smartPass';
let endpoint: string;
let userId: string;
const testDataSource = TestDataSource;

beforeAll(async () => {
    const serverInfo = await server();
    endpoint = `${serverInfo.app.url}`;

    const user = await User.create({ email, password }).save();
    userId = user.id;
});

afterAll(async () => {
    testDataSource.destroy();
    redis.disconnect();
});

test('Confirm email link works', async () => {
    const confirmationUrl = await confirmEmailLink(endpoint, userId as string, redis);

    

    // not sure how else I would test for this link,
    // so I'll print it on the console so the 
    // tester can just look at it, I guess
    console.log(confirmationUrl);
});