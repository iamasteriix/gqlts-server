import { request, gql } from 'graphql-request';
import { dev_endpoint } from "./constants";
// import { main } from '../server';


const mutation = gql`
        mutation($input: CreateUserInput!) {
            register(input: $input)
}
`;
const variables = {
    input: {
        email: "fish@mail.com",
        password: "milk"
      }
}

it('Runs a health to test registering users', async () => {
    const response = await request(dev_endpoint, mutation, variables);
    expect(response).toBeTruthy();
    expect(response.errors).toBeFalsy();
    expect(response).toHaveProperty('register');
    expect(response.register).toEqual(true);
})