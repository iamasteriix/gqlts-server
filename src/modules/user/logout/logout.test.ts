import axios from 'axios';
import { gql } from 'graphql-request';
import server from '../../../server';


let endpoint: string;

beforeAll(async () => {
    const serverInfo = await server();
    endpoint = `${serverInfo.graphqlPath}`;
});

const logout_mutation = gql`
    mutation { logout }
`;

describe('Logout', () => {
    it('Test for errorless logout', async () => {
        const response = await axios.post(
            endpoint,
            { query: logout_mutation },
            { withCredentials: true }
        );

        expect(response).toHaveProperty('data');
        expect(response.data).toHaveProperty('data');
        expect(response.data.data).toHaveProperty('logout');
        expect(response.data.data.logout).toBe(true);
    });

    /**
     * TODO: better tests
     * 
     * Current testing is not sufficient since I have not figured out storing
     * cookie ids for every logged in user. To run better tests:
     * - log in to create a session with cookie data and specifically cookie ids for each user.
     * - query session to make sure user is correctly logged in with the correct session information with some user's user id
     * - logout and run correct logging in test and make sure it fails.
     * Essentially what we want is to query the logged in user and get `null` back.
     */
});