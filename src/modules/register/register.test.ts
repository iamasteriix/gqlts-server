import { request, gql } from 'graphql-request';
import { User } from '../../entity/User';
import server from '../../server';


let getAddress = () => '';

beforeAll(async () => {
    const app = await server();
    const url = app.url;
    getAddress = () => `${url}`
});


const email = "mario@mail.com";
const password = "milk";
const mutation = gql`
    mutation($input: CreateUserInput!) {
        register(input: $input) {
            path,
            message
        }
}
`;
const variables = {
    input: {
        email: email,
        password: password
      }
}


it('Registering users test', async () => {
    const response = await request(getAddress(), mutation, variables);

    // test endpoint data
    expect(response).toBeTruthy();
    expect(response.errors).toBeFalsy();
    expect(response).toHaveProperty('register');
    expect(response.register).toBe(null);

    // test data inserted into database
    const users = await User.find({ where: {email} });
    const user = users[0];
    expect(users).toHaveLength(1);
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    // test entering existing email
    const response2 = await request(getAddress(), mutation, variables);
    expect(response2.register).toHaveLength(1);
    expect(response2.register[0].path).toEqual('email')
});

// TODO: close whatever connection exists after jest test.