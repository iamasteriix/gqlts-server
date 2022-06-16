# Notes

### TODO

- [ ] Need to destroy the database connection after running test server.
- [x] Need to use another mailing service for the email confirmation feature. I should check out mailchimp, or something.
- [x] Implement cookie jar that stores axios response cookies. Fixed: This seem to already exist in axios.
- [ ] Send 'Change password' email.


### Notes

- Currently, we are not logging in the user using `axios`. Not quite sure how to sort that out, but at least I found what the issue was.
- I think I fixed this.


## Useful resources

1. [Generating typescript](https://www.youtube.com/watch?v=rT_jKDNMgRw) from your graphql definitions.
1. [Find typedefs](https://github.com/ardatan/graphql-tools/issues/1932) from `gql`/`graphql` files.
1. [Typeorm changelogs](https://github.com/typeorm/typeorm/blob/master/CHANGELOG.md).
1. [Graphql code generator](https://www.graphql-code-generator.com/docs/config-reference/codegen-config) with `codegen`.
