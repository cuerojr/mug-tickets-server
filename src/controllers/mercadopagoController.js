const { response } = require('express');
const { createTransaction, feedback } = require('../helpers/mercadopago');

class MercadopagoController {    
    constructor(){}

    async create(req, res = response) {
        try {
            createTransaction(req.body);

            res.status(200).json({
                ok: true,
                token
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