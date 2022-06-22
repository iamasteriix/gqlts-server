import { errorMessages } from '../../constants';
import { User } from '../../../entity/User';
import server from '../../../server';
import { TestClient } from '../../../utils/TestClient';


let endpoint: string;
let user: User;
const email = 'mario@mail.com';
const password = "whatever";

beforeAll(async () => {
  const serverInfo = await server();
  const url = serverInfo.graphqlPath;
  endpoint = `${url}`;
  user = await User.create({ email, password }).save(); // create user
});

const gotResponse = (response: any) => {
  expect(response).toBeTruthy();
  expect(response.errors).toBeFalsy();
  expect(response).toHaveProperty('data');
  expect(response.data).toHaveProperty('data');
  return response.data.data;
}

describe('Login', () => {
  it('Test send back error because email not found', async () => {
    const client = new TestClient(endpoint);
    const response = await client.login('new@mail.com', 'some_password');
    const received = gotResponse(response); 
    expect(received.login).toHaveLength(1);
    expect(received.login[0].message).toBe(errorMessages.invalidLogin);
  });

  it('Test email not confirmed', async () => {
    // This test might take quite a bit of time
    const client = new TestClient(endpoint);
    const response = await client.login(email, password);
    console.log(response.data);
    const received = gotResponse(response);
    expect((user as User).confirmed).toBeFalsy();
    expect(received.login[0].message).toBe(errorMessages.emailNotConfirmed);
  });

  it('Test for bad password', async () => {
    await User.update({ email: email }, { confirmed: true });
    const client = new TestClient(endpoint);
    const response = await client.login(email, 'bad_password');
    const received = gotResponse(response);
    expect(received.login[0].message).toBe(errorMessages.invalidLogin);
  });

  it('Test successful login', async () => {
    await User.update({ email: email }, { confirmed: true });
    const client = new TestClient(endpoint);
    const response = await client.login(email, password);
    const received = gotResponse(response);
    expect(received.login).toBeNull();
  });

  it('Test logging into multiple sessions', async () => {
    const sess1 = new TestClient(endpoint);
    const sess2 = new TestClient(endpoint);
    await sess1.login(email, password);
    await sess2.login(email, password);
    const personSess1 = await sess1.person();
    const personSess2 = await sess2.person();
    expect(personSess1.data.data).toEqual(personSess2.data.data);
  });
});