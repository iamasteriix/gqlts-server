import axios from 'axios';
import { request, gql } from 'graphql-request';


export class TestClient {
  input: {
    email: string,
    password: string
  };
  endpoint: string;
  loginMutation: string;
  logoutMutation: string;
  personQuery: string;

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

  async login() {
    this.loginMutation = gql`
      mutation {
        login(input: {
          email: "mario@mail.com",
          password: "whatever"
          })
          { path, message }}`;

    return await axios.post(
      this.endpoint,
        { query: this.loginMutation },
        { withCredentials: true }
      );
    }

  async person() {
    this.personQuery = gql`
      query {
        person { id, email } }`;

    return await axios.post(
      this.endpoint,
        { query: this.personQuery },
        { withCredentials: true }
      );
    }

  async logout() {
    this.logoutMutation = gql`
      mutation { logout }`;

    return await axios.post(
      this.endpoint,
      { query: this.logoutMutation },
      { withCredentials: true }
    )
  }
}

// TODO: implement cookie jar that stores axios response cookies.