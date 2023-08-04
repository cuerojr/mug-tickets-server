const mercadopago = require("mercadopago");

const createTransaction = async (options = {}) => {
    console.log(options)
    try{
        const { description, price, quantity } = options;
        // REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
        mercadopago.configure({
            access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
        });
    
        let preference = {
            items: [
                {
                    title: description,
                    unit_price: Number(price),
                    quantity: Number(quantity),
                }
            ],
            back_urls: {
                success: "http://localhost:8080/feedback",
                failure: "http://localhost:8080/feedback",
                pending: "http://localhost:8080/feedback"
            },
            auto_return: "approved",
        };
    
        const response = await mercadopago.preferences.create(preference);
        if (response) {
            return {
                ok: true,
                id: response.body.id
            };
        }

        return { 
            ok: false, 
            error: 'Algo salió mal con MP' 
        };

    } catch(err) {
        return { 
            ok: false, 
            error: err.message 
        };
    }
};

module.exports = {
    createTransaction
};