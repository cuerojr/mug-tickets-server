import 'dotenv/config';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const SendMail = async (tickets = []) => {
    try {
        //console.log(tickets[0])
        const attachmentsFormated = [...tickets].map((ticket, index) => {            
            return {
              filename: `ticket-${ index + 1 }.png`,
              content: `${ticket.qrCode.split(',').at(-1)}`,
              type: 'plain/text',
              disposition: 'attachment',              
              content_id: `ticket-${ index + 1 }`
            }
        });
        const email = `${tickets[0].purchaser.purchaserEmail}`;
        const msg = {
            to: email, // Change to your recipient
            from: 'mug.rosario@gmail.com', // Change to your verified sender
            subject: 'Entradas FestiMug',
            html: '<p>Here’s an attachment for you!</p>',
            attachments: attachmentsFormated,
        }
        
        const res = await sgMail.send(msg);
        console.log(res)

    } catch (error) {
        console.error(error.message.body)
    }
}