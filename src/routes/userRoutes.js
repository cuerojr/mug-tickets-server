const { Router } = require('express');
const router = Router();
const UserController = require('../controllers/userController');
const userController = new UserController();

router.get('/', userController.getAll);

router.post('/', userController.create);

router.get('/:id', userController.get);

router.put('/:id', userController.update);

router.delete('/:id', userController.delete);

module.exports = router;