import axios from 'axios';
import { gql } from 'graphql-request';
import { User } from '../../entity/User';
import server from '../../server';


beforeAll(async () => {
    const serverInfo = await server();
    endpoint = `${serverInfo.url}`;
    user = await User.create({ email, password, confirmed }).save();
});

const email = 'user@mail.com';
const password = 'smartPass';
const confirmed = true;
let endpoint: string;
let user: User;
const loginMutation = gql`
    mutation($input: UserInput!) {
        login(input: $input) {
            path,
            message
        }
    }`;
// const variables = { input: { email: email, password: password } };

describe('Person', () => {
    it('Test if cannot get user if they are not logged in', async () => {});

    it('Test get current user', async () => {
        // not exactly sure how to test this.
        // not even sure what is happening here.
        await axios.post(
            endpoint,
            { query: loginMutation },
            { withCredentials: true }
        );
    });
});