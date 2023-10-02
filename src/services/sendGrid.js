import sgMail from '@sendgrid/mail';
sgMail.setApiKey('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');

export const SendMail = async (tickets = []) => {
    try {
        console.log('tickets', tickets)
        const msg = {
            to: 'rojonicolasdev@gmail.com', // Change to your recipient
            from: 'mug.rosario@gmail.com', // Change to your verified sender
            subject: 'Sending with SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
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