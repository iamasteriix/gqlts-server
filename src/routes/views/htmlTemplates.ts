/**
 * This folder is mainly meant to hold any html/css/js integrations.
 * Now, we're only using it for html template strings for `nodemailer`;
 */


export const signingUp = (link: string) => `
<html>
  <head>
    <style>
    a {
        background-color: #199319;
        color: white;
        padding: 15px 25px;
        text-decoration: none;
        margin: 1rem auto;
      }
    </style>
  </head>
  <body>
    <p>Thanks for signing up to Pug. Before we can continue, we need to validate your email address.</p>
    <a href='${link}'>Verify email</a>
  </body>
</html>
`

export const resetPasswordLink = (link: string) => `
<html>
  <head>
    <style>
      a {
          background-color: #199319;
          color: white;
          padding: 15px 25px;
          text-decoration: none;
          margin: 1rem auto;
        }
    </style>
  </head>
  <body>
    <p>
      We received a notification about changing your password.
      If this was you, press the button below where you will be redirected to reset your password.
    </p>
    <a href='${link}'>Reset password</a>
  </body>
</html>
  `