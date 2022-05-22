import { request, gql } from 'graphql-request';
import { TestDataSource } from '../data-source';
import { User } from '../entity/User';
import { dev_endpoint } from "./constants";


const email = "mario@mail.com";
const password = "milk";
const mutation = gql`
        mutation($input: CreateUserInput!) {
            register(input: $input)
}
`;
const variables = {
    input: {
        email: email,
        password: password
      }
}

it('Runs a health to test registering users', async () => {
    await TestDataSource.initialize(); // start test-server

    const response = await request(dev_endpoint, mutation, variables);
    // test endpoint data
    expect(response).toBeTruthy();
    expect(response.errors).toBeFalsy();
    expect(response).toHaveProperty('register');
    expect(response.register).toEqual(true);

    // test data inserted into database
    const users = await User.find({ where: {email} });
    const user = users[0];
    expect(users).toHaveLength(1);
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
    TestDataSource.destroy();
})