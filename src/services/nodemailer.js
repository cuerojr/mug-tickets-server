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
console.log(tickets)
  

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'cannibal5033@gmail.com',
        pass: 'mxwr kgau sxwq nchl '
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

  const attachmentsFormated = [...tickets].map((ticket, index) => {
    return {
      filename: `ticket-${index}.png`,
      path: ticket.qrCode,
    }
  });

  const mailOptions = {
    from: 'mug.rosario@gmail.com',
    to: tickets[0].purchaser.purchaserEmail,
    subject: 'Entradas FestiMug',
    template: 'email',
    context: {
      tickets
    },
    attachDataUrls: true,
    attachments: attachmentsFormated,
  };
  
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
