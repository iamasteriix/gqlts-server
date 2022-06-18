# Notes

### TODO

- [ ] Need to destroy the database connection after running test server.
- [ ] Send 'Change password' email.
- [ ] Should add a 'A new account tried to log into your account' and 'a new account just logged into your account' with recorded time and possible location to verify user actually changed their password.
- [ ] Add password reset confirmation html template.
- [ ] Expire previous link if user sends multiple requests to reset password.
- [ ] Finish setting up tests for `forgotPassword`.
- [ ] Implement tracking login attempts.
- [ ] Send unconfirmed user another registration confirmation link.


### Notes

- Axios returns all the cookie data so I don't need to worry about some cookie jar integration.
- I'm thinking of using redis for tracking login attempts. The idea is that if the user makes 5 unsuccessful login 
attempts, the server identifies their email and stops them from logging in for an hour. This process is allowed three times,
and the account is locked on the third attempt.
- I just noticed an error in the registration login: If they don't confirm their email, it still exists in the database despite
not having an account. This prevents users from signing up after the link expired with the same password. I also wanted to fix this
with redis, but I think a better idea would be to send them another confirmation link. This should be easy to implement: if email exists in the database but `confirmed` is `false`, send another link.


## Useful resources

1. [Generating typescript](https://www.youtube.com/watch?v=rT_jKDNMgRw) from your graphql definitions.
1. [Find typedefs](https://github.com/ardatan/graphql-tools/issues/1932) from `gql`/`graphql` files.
1. [Typeorm changelogs](https://github.com/typeorm/typeorm/blob/master/CHANGELOG.md).
1. [Graphql code generator](https://www.graphql-code-generator.com/docs/config-reference/codegen-config) with `codegen`.
1. [Nodemailer](https://nodemailer.com/about/) documentation.
1. How to [use GraphQL with Postman](https://www.apollographql.com/blog/tooling/graphql-ide/how-to-use-graphql-with-postman/).
1. Authentication examples with Auth0's [`express-openid-connect`](https://github.com/auth0/express-openid-connect/blob/master/EXAMPLES.md).