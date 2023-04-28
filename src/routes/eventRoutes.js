const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const ValidationsMiddlewares  = require('../middlewares/validationMiddleware');
const validationsMiddlewares = new ValidationsMiddlewares();

const EventController = require('../controllers/eventController');
const eventController = new EventController();

router.get('/', eventController.getAll);

router.post('/', eventController.create);

router.get('/:id', eventController.get);

router.put('/:id', eventController.update);

router.delete('/:id', eventController.delete);

module.exports = router;