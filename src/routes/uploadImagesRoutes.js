const { Router } = require('express');
const fileUpload = require('express-fileupload');
const router = Router();

import { ValidationsMiddlewares } from '../middlewares/validationMiddleware';
import { UploadImagesController } from '../controllers/uploadImagesController';

const validationsMiddlewares = new ValidationsMiddlewares();
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