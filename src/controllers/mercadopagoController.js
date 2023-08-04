const { response } = require('express');
const mercadopago = require("mercadopago");
const { createTransaction, callbackReturn } = require('../helpers/mercadopago');

class MercadopagoController {    
    constructor(){}

    async create(req, res = response) {
        try {
            
            const { description, price, quantity } = req.query;
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
                    success: "./feedback",
                    failure: "./feedback",
                    pending: "./feedback"
                },
                auto_return: "approved",
            };
        
            const response = await mercadopago.preferences.create(preference);
            if (response) {
                return res.status(200).json({
                    ok: true,
                    id: response.body.id
                });
            }   
            res.status(500).json({ 
                ok: false, 
                error: 'Algo salió mal con MP' 
            });   

        } catch (err) {
            res.status(500).json({ 
                ok: false, 
                error: err.message
            });
        }
    }

    async feedback(req, res = response) {
        const { payment_id, status, merchant_order_id } = req.query;
        try {
            res.status(200).json({
                Payment: payment_id,
                Status: status,
                MerchantOrder: merchant_order_id
            });
        } catch (err) {
            res.status(500).json({ 
                ok: false, 
                error: err.message 
            });
        }
    };
}

module.exports = {
    MercadopagoController
};