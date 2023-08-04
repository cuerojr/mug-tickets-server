const { Router } = require('express');
const router = Router();

const { MercadopagoController } = require('../controllers/mercadopagoController');
const mercadopago = new MercadopagoController();

router.post('/create_preference', mercadopago.create);

router.get('/feedback', mercadopago.feedback);

module.exports = router;