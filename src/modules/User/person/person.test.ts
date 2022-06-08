import axios from 'axios';
import { gql } from 'graphql-request';
import { User } from '../../../entity/User';
import server from '../../../server';


beforeAll(async () => {
    const serverInfo = await server();
    endpoint = `${serverInfo.graphqlPath}`;
    user = await User.create({ email, password, confirmed }).save();
    userId = user.id;
});

let userId: string;
const email = 'user@mail.com';
const password = 'smartPass';
const confirmed = false;
let endpoint: string;
let user: User;
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
        const axiosResponse = await axios.post(
            endpoint,
            { query: loggedInUserQuery },
            { withCredentials: true }
        );

        expect(axiosResponse).toHaveProperty('data');
        expect(axiosResponse.data).toHaveProperty('data');
        expect(axiosResponse.data.data).toHaveProperty('person');
        expect(axiosResponse.data.data.person.email).toBe(email);
        expect(axiosResponse.data.data.person.id).toBe(userId);
    });
});