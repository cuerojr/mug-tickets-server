import path from 'path';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import * as PDFDocument from 'pdfkit';

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
        filename: `ticket-${1}.png`,
        path: tickets[0].qrCode,
        //cid: 'tito'
      },
      {
        filename: `ticket-${2}.png`,
        path: tickets[1].qrCode,
        //cid: 'tito2'
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
