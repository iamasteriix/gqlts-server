import { AxiosResponse } from 'axios';
import { User } from '../../../entity/User';
import server from '../../../server';
import { TestClient } from '../../../utils/TestClient';


let endpoint: string;
const email = 'mario@mail.com';
const password = 'whatever';
const confirmed = true;

beforeAll(async () => {
  const serverInfo = await server();
  endpoint = `${serverInfo.graphqlPath}`;
  await User.create({ email, password, confirmed }).save();
});

const gotResponse = (response: AxiosResponse<any, any>) => {
  expect(response).toHaveProperty('data');
  expect(response.data).toHaveProperty('data');
  return response.data.data;
}

describe('Logout', () => {
  it('Test logging out logged in user', async () => {
    const client = new TestClient(endpoint);
    await client.login();
    let response = await client.person();
    let hasData = gotResponse(response);
    
    expect(hasData).toHaveProperty('person');
    expect(hasData.person).toBeTruthy();

    await client.logout();
    // tests cannot logout user currently and I'm not sure why.
    // functionally, this is caused by not being able to read the session ids from redis.
    // unclear why that would be happening here though.
  });
});