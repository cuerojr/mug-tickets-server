import config from '../config/config.js';
import cloudinary from 'cloudinary';

cloudinary.v2.config({ 
  cloud_name: config.CLOUD_NAME, 
  api_key: config.CLOUDINARY_KEY,
  api_secret:  config.CLOUDINARY_SECRET 
});

const uploadCloudImage = async (filePath = '', folder = '') => {
    return await cloudinary.v2.uploader.upload(filePath, {
        folder,
    }, (error, result) => {
        error? console.log(error) : ''
    });
}

export {
    uploadCloudImage
};