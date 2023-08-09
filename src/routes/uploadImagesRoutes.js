const { Router } = require('express');
const router = Router();

const fileUpload = require('express-fileupload');
const ValidationsMiddlewares  = require('../middlewares/validationMiddleware');
const validationsMiddlewares = new ValidationsMiddlewares();

const UploadImagesController = require('../controllers/uploadImagesController');
const uploadImagesController = new UploadImagesController();

// Middleware: fileUpload (File upload middleware to handle image uploads)
router.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads',
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

module.exports = router;