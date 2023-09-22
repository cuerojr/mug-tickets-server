import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_KEY,
  api_secret:  process.env.CLOUDINARY_SECRET 
});

const uploadCloudImage = async (file, folder = '') => {
    /*return await cloudinary.v2.uploader.upload(filePath, {
        folder,
    }, (error, result) => {
        error? console.log(error) : ''
    });*/
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({}, (err, result) => {
            if(err) {
                reject(err);
            }  
            resolve(result);
        }).end(buffer);
    });
}

export {
    uploadCloudImage
};