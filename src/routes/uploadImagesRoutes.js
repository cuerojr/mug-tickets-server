const { Router } = require('express');
const router = Router();

const fileUpload = require('express-fileupload');
const ValidationsMiddlewares  = require('../middlewares/validationMiddleware');
const validationsMiddlewares = new ValidationsMiddlewares();

const UploadImagesController = require('../controllers/uploadImagesController');
const uploadImagesController = new UploadImagesController();

// file upload middleware
router.use(fileUpload());

router.put('/:type/:id', 
    [     
        validationsMiddlewares.validateJWT,         
        validationsMiddlewares.validateFields
    ],
    uploadImagesController.upload);

module.exports = router;