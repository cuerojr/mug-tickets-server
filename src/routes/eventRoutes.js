const { Router } = require('express');
const router = Router();
const EventController = require('../controllers/eventController');
const eventController = new EventController();

router.get('/', eventController.getAll);

router.post('/', eventController.create);

router.get('/:id', eventController.get);

router.put('/:id', eventController.update);

router.delete('/:id', eventController.delete);

module.exports = router;