const config = require('../config/config');
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: config.CLOUD_NAME, 
  api_key: config.CLOUDINARY_KEY,
  api_secret:  config.CLOUDINARY_SECRET 
});

const uploadCloudImage = async (filePath = '', folder = '') => {
    return await cloudinary.uploader.upload(filePath, {
        folder,
    }, (error, result) => {
        error? console.log(error) : ''
    });
}

module.exports = {
    uploadCloudImage
};