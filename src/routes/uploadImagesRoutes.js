import { Router } from 'express';
const router = Router();

import fileUpload from 'express-fileupload';
import { ValidationsMiddlewares } from '../middlewares/validationMiddleware.js';
const validationsMiddlewares = new ValidationsMiddlewares();

import {UploadImagesController} from '../controllers/uploadImagesController.js';
const uploadImagesController = new UploadImagesController();

// Middleware: fileUpload (File upload middleware to handle image uploads)
router.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './public/uploads',
}));

// Route: PUT /api/upload/:type/:id
// Middleware: validateJWT (Validates the JSON Web Token in the request header)
// Middleware: validateFields (Validates request body fields)
// Controller: uploadImagesController.upload (Controller method to upload an image)
router.put('/:type/:id', 
    [     
        validationsMiddlewares.validateJWT,         
        validationsMiddlewares.validateFields
    ],
    uploadImagesController.upload);

export {
    router
};