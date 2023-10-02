import 'dotenv/config';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const SendMail = async (tickets = []) => {
    try {
        console.log('tickets', tickets)
        const attachmentsFormated = [...tickets].map((ticket, index) => {
            return {
              filename: `ticket-${index}.png`,
              path: ticket.qrCode,
            }
        }); 

        const msg = {
            to: 'rojonicolasdev@gmail.com', // Change to your recipient
            from: 'mug.rosario@gmail.com', // Change to your verified sender
            subject: 'Entradas FestiMug',
            text: 'and easy to do anywhere, even with Node.js',
            html: `<strong>${tickets[0].purchaser.purchaserEmail}</strong>`,
        }

        
        sgMail
            .send(msg)
            .then((response) => {
                console.log(response[0].statusCode)
                console.log(response[0].headers)
            })
            .catch((error) => {
                console.error(error)
            });

    } catch (error) {
        console.error(error.message)
    }
}