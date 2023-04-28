const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const ValidationsMiddlewares  = require('../middlewares/validationMiddleware');
const validationsMiddlewares = new ValidationsMiddlewares();

const TicketController = require('../controllers/ticketController');
const ticketController = new TicketController();

router.get('/', ticketController.getAll);

router.post('/', 
    [
        /*check('firstName', 'firstName is required').not().isEmpty(),
        check('lastName', 'lastName is required').not().isEmpty(),
        check('dni', 'DNI is required').not().isEmpty(),
        check('password', 'password is required').not().isEmpty(), 
        check('email', 'email is required').not().isEmpty(),  */
        validationsMiddlewares.validateFields, 
    ]
,ticketController.create);

router.get('/:id', ticketController.get);

router.put('/:id', ticketController.update);

router.delete('/:id', ticketController.delete);

module.exports = router;