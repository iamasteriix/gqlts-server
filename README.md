# gqlts-server

A boilerplate node.js server made with Typescript, Graphql, Typeorm and Postgres that handles user authentication and 
authorization. This includes:
- registration
- login
- logout, and
- handling 'forgot password'



## Getting started

Before you can start the application, download the project and install the dependencies:
```
git clone https://github.com/iamasteriix/gqlts-server.git
npm i
```
then add a session secret to the *.env* file for the session middleware. You can generate a 32-character 'random' string on the
terminal with `openssl rand -base64 32` or `openssl rand -hex 32`.
**Remember to add the *.env* file to your *.gitignore*.**

Start the application with
```
npm start
```

Currently, Apollo's graphql playground does not seem to allow cookies you create from a graphql application on the browser so 
trying to run the login mutation is almost guaranteed to fail. I found **trying Postman** instrumental during development.


### Build

Running the build version of the project has not been a priority. That said, if you are using VS Code, you can add the following
scripts to your *package.json* to support the IDE's build and clean commands.
```
"scripts {
  ...
  "build": "tsc --build",
  "clean": "tsc --build --clean"
  }
```
Alternatively, you can use your favorite third-party tool like webpack to build the application following their guide for 
compiling and running Typescript.


### Testing

The test suite is not the most robust (I apologize), and perhaps the biggest problem is that I have not been able to run the 
tests in parallel. This forces us to run the tests individually. Currently, the test suite contains tests for each folder inside
the *user* module (besides the inconsequential *tempdir*), and one inside *routes*. Running `npm test <dir-with-test>` should pass.
I would appreciate improvements on the test suite.

About the problem with testing, all(?) tests require starting a connection to some temporary postgres database instance, and each
one of them drops this instance before running the tests. This is obviously a problem, because if one test drops the database for
a test that is already running, all subsequent test cases will fail.

I am not sure how I should fix this, and any contributions/advice will be appreciated.




## Using the application

The project was meant to be a boilerplate for when you are building an application and needed a backend you could modify. To that
end, navigate into your project's *root* or *packages* directory and run
```
git clone https://github.com/iamasteriix/gqlts-server.git server
```
It will create a directory named *server* with all the files in it. Subsequently, follow the steps in
[Getting started](https://github.com/iamasteriix/gqlts-server/blob/main/README.md#getting-started).

Optionally, you can also add the project as a submodule using
```
git submodule add https://github.com/iamasteriix/gqlts-server.git server
```
Other instructions for using this as a submodule can be found in this [submodule documentation](https://devconnected.com/how-to-add-and-update-git-submodules/).

You might need to move a few files from this project around and perhaps delete some to maintain the integrity of the overall
structure of your project. The most significant one of these is the *tsconfig.json* file, which you are advised to move to your
root directory, then extend its base settings to the local (as in the server's own) *tsconfig.json* as of Typescript 2.1. For
example:
*base.json*
```
{
  "compilerOptions": {
    "target": "es2017",
    "module": "commonjs",
    "lib": ["dom", "es6", "es2017", "esnext.asynciterable"],
    "sourceMap": true,
    "outDir": "./dist",
    "moduleResolution": "node",
  }
}
```

*server/tsconfig.json*
```
{
  "extends": "../base.json",
  "compilerOptions": {
    "skipLibCheck": true
  },
  "files": ["main.ts", "supplemental.ts"]
}
```
You can find more information about Typescript's `extends` from the
[documentation](https://www.typescriptlang.org/tsconfig/extends.html).

If you are experiencing any problems, check out the issues on the [Issues](https://github.com/iamasteriix/gqlts-server/issues)
tab above.

#### Sending emails

Under development, the emails are supposed to be sent to whatever address 'the user' adds, but `nodemailer` allows you to preview
the template by printing a string to the console. Following this link will allow you to 'test-confirm' user registration.




## Find a bug?

If you found an issue or would like to submit an improvement to this project, please submit an issue using the issues tab above.
If you would like to submit a PR with a fix, reference the issue you created!




## Find out more.

- This project was greatly inspired by [Ben Awad](https://www.youtube.com/c/BenAwad97)'s own 
[graphql-ts-server-boilerplate](https://github.com/benawad/graphql-ts-server-boilerplate/). I tried using the boilerplate for a
different project by fixing a few things, but so much had changed in the few years since it was last updated I figured it'd be
worth the shot to rebuild it from scratch.

- A few things I'm thinking of adding or updating are included in the my
[notes](https://github.com/iamasteriix/gqlts-server/blob/main/notes.md).