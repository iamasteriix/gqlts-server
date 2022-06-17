import { AxiosResponse } from 'axios';
import { User } from '../../../entity/User';
import { redis } from '../../../redis';
import server from '../../../server';
import { forgotPasswordLink } from '../../../utils/createLinks';
import { TestClient } from '../../../utils/TestClient';


let endpoint: string;
let url: string;
let user: User;
let userId: string;
const email = 'mario@mail.com';
const password = 'whatever';
const newPassword = 'totallyNewPassword';
const confirmed = true;

beforeAll(async () => {
  const serverInfo = await server();
  endpoint = `${serverInfo.graphqlPath}`;
  url = `${serverInfo.url}`;
  user = await User.create({ email, password, confirmed }).save();
  userId = user.id;
});

const gotResponse = (response: AxiosResponse<any, any>) => {
  expect(response).toHaveProperty('data');
  expect(response.data).toHaveProperty('data');
  return response.data.data;
}

describe('Forgot password', () => {
  it('Test that the account is locked', async () => {
    // test that the account is locked.
    // test that unauthorized user can't log into the account with the same credentials
  });

  it('Test user can change password only once', async () => {
    // check that key has been used to change password once and so cannot do it again.
  });

  it('Test that we can log in with new password.', async () => {
    const client = new TestClient(endpoint);
    const link = await forgotPasswordLink(url, userId, redis);
    const key = link.split('/')[-1];

    let response = await client.forgotPasswordChangeIt(newPassword, key);
    gotResponse(response);
    // test for this response
    // log in with new password
    // test for correct login
  });
});