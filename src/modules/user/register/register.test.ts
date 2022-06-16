import { User } from '../../../entity/User';
import server from '../../../server';
import { TestClient } from '../../../utils/TestClient';
import { errorMessages } from '../../constants';


let endpoint: string;
const email = 'mario@mail.com';
const password = 'whatever';

beforeAll(async () => {
    const serverInfo = await server();
    const url = serverInfo.graphqlPath;
    endpoint = `${url}`;
});

const gotResponse = (response: any, len: number, path: string, msg: string) => {
  expect(response).toBeTruthy();
  expect(response.errors).toBeFalsy();
  expect(response).toHaveProperty('register');
  if (len === 0) expect(response.register).toBe(null);
  if (path && msg) expect(response.register[0]).toEqual({ path: path, message: msg });
}

describe('Registering users test', () => {
  it('Test endpoint as string data', async () => {
    const client = new TestClient(endpoint);
    const response = await client.register(email, password);
    gotResponse(response, 0, '', '');
  });

  it('Test user registration input data', async () => {
    const users = await User.find({ where: { email } });
    const user = users[0];
    expect(users).toHaveLength(1);
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
  });

  it("Check for duplicate emails", async () => {
    const client = new TestClient(endpoint);
    const response = await client.register(email, password);
    gotResponse(response, 1, 'email', errorMessages.duplicateEmail);
  });
    
  it("Check for bad email", async () => {
    const client = new TestClient(endpoint);
    const response = await client.register('em_com', password);
    gotResponse(response, 1, 'email', errorMessages.badEmail);
  });

  it("Check for short password", async () => {
    const client = new TestClient(endpoint);
    const response = await client.register(email, 'long');
    gotResponse(response, 1, 'password', errorMessages.shortPassword);
  });

  it("Check for bad email and short password", async () => {
    const client = new TestClient(endpoint);
    const response = await client.register('email', 'pass');
    gotResponse(response, 2, '', '');
  });
});

// TODO: close whatever connection exists after jest test.