import { AxiosResponse } from 'axios';
import { User } from '../../../entity/User';
import server from '../../../server';
import { TestClient } from '../../../utils/TestClient';


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

const gotResponse = (response: AxiosResponse<any, any>) => {
  expect(response).toHaveProperty('data');
  expect(response.data).toHaveProperty('data');
  return response.data.data;
}

describe('Person', () => {
  it('Test cannot get user if they are not logged in', async () => {
    // TODO: test for no cookie response if user is not logged in.
  });

  it('Test null if no cookies', async () => {
    // TODO: test null if no cookies.
  });

  it('Test get current user', async () => {
    const client = new TestClient(endpoint);
    let response = await client.person();
    let hasData = gotResponse(response);
    expect(hasData).toHaveProperty('person');
    expect(hasData.person.email).toBe(email);
    expect(hasData.person.id).toBe(userId);
  });
});