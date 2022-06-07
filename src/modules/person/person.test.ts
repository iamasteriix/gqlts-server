import axios from 'axios';
import { gql } from 'graphql-request';
import { User } from '../../entity/User';
import server from '../../server';


beforeAll(async () => {
    const serverInfo = await server();
    endpoint = `${serverInfo.graphqlPath}`;
    user = await User.create({ email, password, confirmed }).save();
    userId = user.id;
});

let userId: string;
const email = 'user@mail.com';
const password = 'smartPass';
// const input = { email, password };
const confirmed = true;
let endpoint: string;
let user: User;
// const loginMutation = gql`
//     mutation {
//         login(input: "${input}") {
//             path,
//             message
//         }
//     }`;
const temp = gql`
query {
  person {
    email,
    id
  }
}
`;

describe('Person', () => {
    it('Test if cannot get user if they are not logged in', async () => {});

    it('Test get current user', async () => {
        const response = await axios.post(
            endpoint,
            { query: temp },
            { withCredentials: true }
        );
        expect(response).toHaveProperty('data');
        expect(response.data).toHaveProperty('data');
        expect(response.data.data).toHaveProperty('person');
        expect(response.data.data.person.email).toBe(email);
        expect(response.data.data.person.id).toBe(userId);
    });
});