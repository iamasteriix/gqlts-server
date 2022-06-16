import { AxiosResponse } from 'axios';
import { User } from '../../../entity/User';
import { redis } from '../../../redis';
import server from '../../../server';
import { forgotPasswordLink } from '../../../utils/createLinks';
import { TestClient } from '../../../utils/TestClient';


let endpoint: string;
let user: User;
let userId: string;
const email = 'mario@mail.com';
const password = 'whatever';
const newPassword = 'totallyNewPassword';
const confirmed = true;

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

describe('Forgot password', () => {
  it('Test that we can log in with new password.', async () => {
    const client = new TestClient(endpoint);
    const url = await forgotPasswordLink('', userId, redis);
    const key = url.split('/')[-1];

    let response = await client.forgotPasswordChangeIt(newPassword, key);
    gotResponse(response);
    // test for this response
    // log in with new password
    // test for correct login
  });
});