# Notes

### TODO

- [ ] Need to destroy the database connection after running test server.
- [ ] Need to use another mailing service for the email confirmation feature. I should check out mailchimp, or something.


### Notes

- Currently, we are not logging in the user using `axios`. Not quite sure how to sort that out, but at least I found what the issue was.
- The query should not return anything if the user is not registered.
- It seems to be the case that the session data does not persist.


## Useful resources

1. [Generating typescript](https://www.youtube.com/watch?v=rT_jKDNMgRw) from your graphql definitions.
1. [Find typedefs](https://github.com/ardatan/graphql-tools/issues/1932) from `gql`/`graphql` files.
1. [Typeorm changelogs](https://github.com/typeorm/typeorm/blob/master/CHANGELOG.md).
1. [Graphql code generator](https://www.graphql-code-generator.com/docs/config-reference/codegen-config) with `codegen`.
