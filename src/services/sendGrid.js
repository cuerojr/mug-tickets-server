import 'dotenv/config';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const SendMail = async (tickets = []) => {
    try {
        const email = `${tickets[0].purchaser.purchaserEmail}`;
        const attachmentsFormated = [...tickets].map((ticket, index) => {            
            return {
              filename: `ticket-${ index + 1 }.png`,
              content: `${ticket.qrCode.split(',').at(-1)}`,
              type: 'plain/text',
              disposition: 'attachment',              
              content_id: `ticket-${ index + 1 }`
            }
        });

        const htmlFormatted = [...tickets].map((ticket, index) => {   
            return `<img src="cid:ticket-${ index + 1 }"/>`;
                     
            return {
              filename: `ticket-${ index + 1 }.png`,
              content: `${ticket.qrCode.split(',').at(-1)}`,
              type: 'plain/text',
              disposition: 'attachment',              
              content_id: `ticket-${ index + 1 }`
            }
        }).join('');
        
        const msg = {
            to: email,
            from: 'mug.rosario@gmail.com',
            subject: 'Entradas FestiMug',
            html: htmlFormatted,
            attachments: attachmentsFormated,           
            
        }
        
        const res = await sgMail.send(msg);
        if (res) return true;

    } catch (error) {
        console.error(error.message.body)
    }
}