import 'dotenv/config';
import Email from 'email-templates';

/**
 * This function sends an email from your domain email address (`sender`) to the
 * recepient's address with the link to confirm registration and update their information
 * in the database.
 * 
 * @param sender the email address of the sender
 * @param recepient the email address of the recepient.
 * @param url the confirmation link.
 */
export const sendEmail = async (sender: string, recepient: string, url: string) => {
  const email = new Email({
    views: { root: __dirname },
    message: { from: sender },
    send: true,
    transport: { jsonTransport: true }
  });

  await email.send({
    template: 'email-template',
    message: { to: recepient },
    locals: { link: url }
  });
}