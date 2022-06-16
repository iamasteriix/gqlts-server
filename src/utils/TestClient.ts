import axios from 'axios';
import { request, gql } from 'graphql-request';


export class TestClient {
  endpoint: string;

  constructor(url: string) {
    this.endpoint = url;
  }

  async register(email: string, password: string){
    const variables = {
      input: { email, password }
    }

    const mutation = gql`
    mutation($input: UserInput!) {
        register(input: $input) {
            path,
            message
        }}`;

    return await request(this.endpoint, mutation, variables);
  }

  async login(email: string, password: string) {
    const loginMutation = gql`
      mutation {
        login(input: {
          email: "${email}",
          password: "${password}"
          })
          { path, message }}`;

    return await axios.post(
      this.endpoint,
        { query: loginMutation },
        { withCredentials: true }
      );
    }

  async person() {
    const personQuery = gql`
      query {
        person { id, email } }`;

    return await axios.post(
      this.endpoint,
        { query: personQuery },
        { withCredentials: true }
      );
    }

  async logout() {
    const logoutMutation = gql`
      mutation { logout }`;

    return await axios.post(
      this.endpoint,
      { query: logoutMutation },
      { withCredentials: true }
    )
  }

  async forgotPasswordChangeIt(newPassword: string, key: string){
    const changePasswordMutation = gql`
      mutation {
        forgotPasswordChangeIt(input: {
          newPassword: "${newPassword}",
          key: "${key}"
        })
        { path, message }}`;

    return await axios.post(
      this.endpoint,
      { query: changePasswordMutation },
      { withCredentials: true }
    )
  }
}