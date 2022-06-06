import 'dotenv/config';
import SparkPost from 'sparkpost';


const client = new SparkPost(process.env.SPARKPOST_API_KEY);

export const sendEmail = async (recepient: string, url: string) => {
    const response = await client.transmissions.send({
        options: {
          sandbox: true
        },
        content: {
          from: 'testing@your-domain-email.com',
          subject: 'Confirm email.',
          html: `<html>
                    <style>
                        .fcc-btn {
                            background-color: #199319;
                            color: white;
                            padding: 15px 25px;
                            text-decoration: none;
                        }
                    <style>
                    <body>
                        <p>Thanks for signing up to _. Before we can continue, we need to validate your email address.</p>
                        <a class="fcc-btn" href="${url}">Verify email</a>
                    </body>
                </html>`
        },
        recipients: [
          {address: recepient}
        ]
      });

      console.log(response);
}