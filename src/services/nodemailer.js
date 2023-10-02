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
export const sendMails = async (tickets = []) => {
  try {
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
  
    const attachmentsFormated = [...tickets].map((ticket, index) => {
      return {
        filename: `ticket-${index}.png`,
        path: ticket.qrCode,
      }
    });

    await new Promise((resolve, reject) => {
      // verify connection configuration
      transporter.verify((error, success) => {
          if (error) {
              console.log(error);
              reject(error);
          } else {
              console.log("Server is ready to take our messages");
              resolve(success);
          }
      });
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
  
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(info);
        }
      });
    });
  } catch (error) {
    console.error(error)
  }
}
