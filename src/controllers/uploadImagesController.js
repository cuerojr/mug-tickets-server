const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { updateImages } = require('../helpers/updateImage');

/**
 * Controller class for handling image upload operations.
 */
class UploadImagesController {    
    constructor(){}

    /**
     * Upload an image for a specific type and ID.
     *
     * @param {Object} req - Express request object containing the type and ID in the request parameters and the image file in the request files.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing the uploaded image filename or an error message.
     */
    upload(req, res = response) {      
      try{
        const { type, id } = req.params;      
        const validTypes = ['events', 'user'];

        if(!validTypes.includes(type)){
          return res.status(400).json({
            ok: false,
            msg: 'Not a valid type.'
          });
        }

        if(!req.files || Object.keys(req.files).length === 0) {
          return res.status(400).json({
            ok: false,
            msg: 'No files were uploaded.'
          })
        }

        const file = req.files.image;      
        const shortName = file.name.split('.');
        const fileExtension = shortName[shortName.length - 1];
        const validExtensions = ['png','jpg','jpeg','gif'];

        if(!validExtensions.includes(fileExtension)) {
          return res.status(400).json({
            ok: false,
            msg: "The file doesn't have a valid extension."
          });
        }

        const fileName = `${ uuidv4() }.${ fileExtension }`;
        const path = `./src/uploads/${ type }/${ fileName }`;

        file.mv(path, (err) => {
          if(err) {
            return res.status(500).json({
              ok: false,
              msg : err,
              path,
              fileName
            });
          }
          
          updateImages({ type, id, fileName });
            
          res.status(200).json({
              ok: true,
              msg: 'File uploaded.',
              fileName
          });
        });
      } catch(err) {
        return res.status(500).json({
          ok: false,
          msg : err.message
        });
      }
    }

}

module.exports = UploadImagesController;
