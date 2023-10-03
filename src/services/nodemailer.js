import path from 'path';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import { ticketNumber as formatedNumber } from '../helpers/dataFormatter.js';
import { dateFormatter, formatTime } from '../helpers/dateFormatter.js'


const email = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;

/**
 * Send an email with provided tickets.
 *
 * @param {Array} tickets - An array of tickets to be included in the email.
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'mug.rosario@gmail.com',
      pass: 'jkhn iusb wpat hsrq'
  }
});
export const sendMails = async (tickets = [], ticketsData = []) => {
  try {
    
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

    const ticketsFormatted = [...tickets].map((ticket, index) => { 
      const { 
        purchaser, 
        attendee, 
        validated, 
        purchased, 
        purchaseDate, 
        validationDate, 
        ticketNumber,
        _id, 
        __v,
        qrCode
      } = ticket;

      return {
        "Entrada nro.": formatedNumber(ticketNumber),
        "Evento": ticketsData[0].title,
        "Tipo de entrada": ticketsData[0].ticketType.type,
        "Fecha y Hora": `${dateFormatter(ticketsData[0].ticketType.date)} - ${formatTime(ticketsData[0].ticketType.date)} `,
        "Dirección": ticketsData[0].address,
        "Nombre y Apellido": `${ purchaser.purchaserFirstName } ${ purchaser.purchaserLastName }`,
        "Dni": purchaser.purchaserDni,
        "Email": purchaser.purchaserEmail,
      }
    });
        
    const attachmentsFormated = [...tickets].map((ticket, index) => {
      return {
        filename: `ticket-${index}.png`,
        path: ticket.qrCode,
        cid:  `ticket-${index}`
      }
    });    
  
    const mailOptions = {
      from: 'mug.rosario@gmail.com',
      to: tickets[0].purchaser.purchaserEmail,
      subject: 'Entradas FestiMug',
      template: 'email',
      context: {
        ticketsFormatted
      },
      attachDataUrls: true,
      attachments: attachmentsFormated,
    };    
  
    const data = await transporter.sendMail(mailOptions);
    if (data) return true;
  } catch (error) {
    console.error(error)
  }
}
