import { request, gql } from 'graphql-request';
import { User } from '../../entity/User';
import server from '../../server';
import { errorMessages } from './constants';


let getAddress = () => '';

beforeAll(async () => {
    const app = await server();
    const url = app.url;
    getAddress = () => `${url}`
});


const email = 'mario@mail.com';
const password = "rick_roll";
const mutation = gql`
    mutation($input: CreateUserInput!) {
        register(input: $input) {
            path,
            message
        }
    }`;
const variables_1 = { input: { email: email, password: password } };
const variables_2 = { input: { email: 'em_com', password: password } };
const variables_3 = { input: { email: email, password: 'long' } };
const variables_4 = { input: { email: 'email', password: 'pass' } };

it('Registering users test', async () => {
    const response_0 = await request(getAddress(), mutation, variables_1);
    const response_1 = await request(getAddress(), mutation, variables_1);
    const response_2 = await request(getAddress(), mutation, variables_2);
    const response_3 = await request(getAddress(), mutation, variables_3);
    const response_4 = await request(getAddress(), mutation, variables_4);

    // test endpoint data
    expect(response_0).toBeTruthy();
    expect(response_0.errors).toBeFalsy();
    expect(response_0).toHaveProperty('register');
    expect(response_0.register).toBe(null);

    // test user registration input data
    const users = await User.find({ where: { email } });
    const user = users[0];
    expect(users).toHaveLength(1);
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    // test for duplicate emails
    expect(response_1.register).toHaveLength(1);
    expect(response_1.register[0]).toEqual({ path: 'email', message: errorMessages.duplicateEmail });

    // test for bad email
    expect(response_2.register).toHaveLength(1);
    expect(response_2.register[0]).toEqual({ path: 'email', message: errorMessages.badEmail });

    // test for short password
    expect(response_3.register).toHaveLength(1);
    expect(response_3.register[0]).toEqual({ path: 'password', message: errorMessages.shortPassword });

    // test for bad email and short password
    expect(response_4.register).toHaveLength(2);
});

// TODO: close whatever connection exists after jest test.