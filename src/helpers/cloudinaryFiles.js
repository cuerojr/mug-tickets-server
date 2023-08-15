import cloudinary from 'cloudinary';
import 'dotenv/config'
cloudinary.v2.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_KEY,
  api_secret:  process.env.CLOUDINARY_SECRET 
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