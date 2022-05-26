import { User } from '../entity/User';
import Redis = require('ioredis');
import { confirmEmailLink } from './confirmEmailLink';

const endpoint = `http://localhost:4000/`;
const email = 'user@mail.com';
const password = 'smartPass';
let userId: string;

beforeAll(async () => {
    const user = await User.create({ email, password }).save();
    userId = user.id;
});

test('Confirm email link works', async () => {
    const redis = new Redis();
    const confirmationUrl = await confirmEmailLink(endpoint, userId as string, redis);
    const response = await fetch(confirmationUrl);

    expect(response).toBeTruthy();

    // not sure how else I would test for this link,
    // so I'll print it on the console so the 
    // tester can just look at it, I guess
    console.log(confirmationUrl);
});