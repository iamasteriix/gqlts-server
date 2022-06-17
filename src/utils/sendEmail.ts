import 'dotenv/config';
import nodemailer from 'nodemailer';

/**
 * This function sends an email from your domain email address (`sender`) to the
 * recepient's address with the link to confirm registration and update their information
 * in the database.
 * 
 * For testing and development purposes, create a `testAccount` that generates a test
 * SMTP service account from ethereal.email. You can find more information about this 
 * from the [Nodemailer](https://nodemailer.com/about/) documentation.
 * 
 * If you do have an email account for these purposes, replace `senderEmail` and `senderPassword`
 * with your credentials, and `'smtp.ethereal.email'` with your preferred email service.
 * 
 * @param recepient the email address of the recepient.
 * @param emailSubject the subject of the email.
 * @param emailType html template.
 */
export const sendEmail = async (recepient: string, emailSubject: string, emailType: string,) => {
  
  const testAccount = await nodemailer.createTestAccount();
  const senderEmail = testAccount.user;
  const senderPassword = testAccount.pass;
  const emailService = 'smtp.ethereal.email';
  
  const transporter = nodemailer.createTransport({
    host: emailService,
    port: 587,
    secure: false,
    auth: {
      user: senderEmail,
      pass: senderPassword
    }
  });

  const info = await transporter.sendMail({
    from: senderEmail,
    to: recepient,
    subject: emailSubject,
    html: emailType
  });

  console.log('Message sent: ', info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}