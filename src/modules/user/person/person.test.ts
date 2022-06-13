import axios from 'axios';
import { gql } from 'graphql-request';
import { User } from '../../../entity/User';
import server from '../../../server';


let userId: string;
const email = 'user@mail.com';
const password = 'smartPass';
const confirmed = true;
let endpoint: string;
let user: User;

beforeAll(async () => {
    const serverInfo = await server();
    endpoint = `${serverInfo.graphqlPath}`;
    user = await User.create({ email, password, confirmed }).save();
    userId = user.id;
});

const loggedInUserQuery = gql`
    query {
        person { email, id }
        }`;

describe('Person', () => {
    it('Test cannot get user if they are not logged in', async () => {
        // TODO: test for no cookie response if user is not logged in.
    });

    it('Test null if no cookies', async () => {
        // TODO: test null if no cookies.
    });

    it('Test get current user', async () => {
        const response = await axios.post(
            endpoint,
            { query: loggedInUserQuery },
            { withCredentials: true }
        );

        expect(response).toHaveProperty('data');
        expect(response.data).toHaveProperty('data');
        expect(response.data.data).toHaveProperty('person');
        expect(response.data.data.person.email).toBe(email);
        expect(response.data.data.person.id).toBe(userId);
    });
});