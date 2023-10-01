import path from 'path';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import { ticketNumber as ticketFormatter } from '../helpers/dataFormatter.js';

const email = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;

/**
 * Send an email with provided tickets.
 *
 * @param {Array} tickets - An array of tickets to be included in the email.
 */
export const sendMail = async (tickets = []) => {
  
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

  const attachmentsFormated = [...tickets].map((ticket, index) => ({
    filename: `ticket-${index + 1}.png`,
    path: ticket.qrCode,
  }));
  
  const formatedTickets = [...tickets].map((ticket) => {
    const { purchaser, ticketNumber } = ticket;
    const formattedTicketNumber = ticketFormatter(ticketNumber);
    return {      
      Nombre: purchaser.purchaserFirstName,
      Apellido: purchaser.purchaserLastName,
      DNI: purchaser.purchaserDni,
      Email: purchaser.purchaserEmail,
      Numero: formattedTicketNumber
    }
  });


  const mailOptions = {
    from: 'mug.rosario@gmail.com',
    to: tickets[0].purchaser.purchaserEmail,
    subject: 'Entradas FestiMug',
    template: 'email',
    context: {
      formatedTickets
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
}
