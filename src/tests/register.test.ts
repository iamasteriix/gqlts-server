import { request } from "graphql-request";
import { devHost } from "./constants";


const user = { email: 'fish@mail.com', password: 'milk' }

const mutation = `
    register(input: "${user}")
`;

test('Register user', async () => {
    const response = await request(devHost, mutation);
    expect(response).toEqual({ register: true });
})