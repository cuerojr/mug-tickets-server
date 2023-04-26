const { Router } = require('express');
const router = Router();
const TicketController = require('../controllers/ticketController');
const ticketController = new TicketController();

router.get('/', ticketController.getAll);

router.post('/', ticketController.create);

router.get('/:id', ticketController.get);

router.put('/:id', ticketController.update);

router.delete('/:id', ticketController.delete);

module.exports = router;