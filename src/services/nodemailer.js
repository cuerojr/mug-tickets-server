import path from 'path';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
const email = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;

/**
 * Send an email with provided tickets.
 *
 * @param {Array} tickets - An array of tickets to be included in the email.
 */
export const sendMail = (tickets = []) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mug.rosario@gmail.com',
        pass: 'jkhn iusb wpat hsrq'
    }
  });

  const handlebarOptions = {
    viewEngine: {
      extName: '.handlebars',
      partialsDir: path.resolve('./views'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./views'),
    extName: '.handlebars'    
  }
  
  transporter.use('compile', hbs(handlebarOptions));
  
  const mailOptions = {
    from: 'mug.rosario@gmail.com',
    to: tickets[0].purchaser.purchaserEmail,
    subject: 'Sending Email using Node.js',
    template: 'email',
    context: {
      tickets
    },
    attachDataUrls: true,
    attachments: [
      {
        filename: 'tito.png',
        content: Buffer.from('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', 'base64'),
        //contentDisposition: 'inline',
        cid: 'tito'
      },
      {
        filename: 'tito2.png',
        content: Buffer.from(tickets[0].qrCode, 'base64'),
        //contentDisposition: 'inline',
      }
    ],
  };
  
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
