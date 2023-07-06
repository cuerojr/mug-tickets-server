const { Router } = require('express');
const router = Router();

const fileUpload = require('express-fileupload');
import { ValidationsMiddlewares } from '../middlewares/validationMiddleware';
const validationsMiddlewares = new ValidationsMiddlewares();

const UploadImagesController = require('../controllers/uploadImagesController');
const uploadImagesController = new UploadImagesController();

// file upload middleware
router.use(fileUpload({
    limits: {
        fileSize: 300000 //300kb
    },
    abortOnLimit: true
}));

router.put('/:type/:id', 
    [     
        validationsMiddlewares.validateJWT,         
        validationsMiddlewares.validateFields
    ],
    uploadImagesController.upload);

module.exports = router;