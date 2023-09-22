import { response } from 'express';
//import { uuidv4 } from 'uuid';
import { updateImages } from '../helpers/updateImage.js';
import { uploadCloudImage } from '../helpers/cloudinaryFiles.js';

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
    async upload(req, res = response) {      
      try{
        const { type, id } = req.params;      
        const validTypes = ['events', 'user'];

        if(!validTypes.includes(type)){
          return res.status(400).json({
            ok: false,
            msg: "Not a valid type."
          });
        }

        if(!req.files || Object.keys(req.files).length === 0) {
          return res.status(400).json({
            ok: false,
            msg: "No files were uploaded."
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
        
        const result =  await uploadCloudImage(file , type);
        const { url } = result;
        
        updateImages({ type, id, url });
            
        res.status(200).json({
            ok: true,
            msg: "File uploaded.",
            url
        });        
      } catch(err) {
        return res.status(500).json({
          ok: false,
          msg : err.message || 'asdadsa'
        });
      }
    }

}

export {
  UploadImagesController
};
