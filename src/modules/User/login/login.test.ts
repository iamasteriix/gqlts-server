import { request, gql } from 'graphql-request';
import { errorMessages } from '../../constants';
import { User } from '../../../entity/User';
import server from '../../../server';


beforeAll(async () => {
    const serverInfo = await server();
    const url = serverInfo.graphqlPath;
    endpoint = `${url}`;
    user = await User.create({ email, password }).save(); // create user
});

let endpoint: string;
let user: User;
const email = 'mario@mail.com';
const password = "whatever";
const loginMutation = gql`
    mutation($input: UserInput!) {
        login(input: $input) {
            path,
            message
        }
    }`;

const variables_01 = { input: { email: 'new@mail.com', password: 'some_password' } };
const variables_02 = { input: { email: email, password: password } };
const variables_03 = { input: { email: email, password: 'bad_password' }};

describe('Login', () => {
    it('Test send back error because email not found', async () => {
        const response = await request(endpoint, loginMutation, variables_01);
        expect(response.login).toHaveLength(1);
        expect(response.login[0].message).toBe(errorMessages.invalidLogin);
    });

    it('Test email not confirmed', async () => {
        const response = await request(endpoint, loginMutation, variables_02);
        expect((user as User).confirmed).toBeFalsy();
        expect(response.login[0].message).toBe(errorMessages.emailNotConfirmed);
    });

    it('Test for bad password', async () => {
        await User.update({ email: email }, { confirmed: true });
        const response = await request(endpoint, loginMutation, variables_03);
        expect(response.login[0].message).toBe(errorMessages.invalidLogin);
    });

    it('Test successful login', async () => {
        await User.update({ email: email }, { confirmed: true });
        const response = await request(endpoint, loginMutation, variables_02);
        expect(response.login).toBeNull();
    });
});