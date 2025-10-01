// backend/utils/cloudinary.js
const cloudinary = require('../config/cloudinary');

exports.uploadImage = async (file, folder = 'dbuian_fashion') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { 
        resource_type: 'image',
        folder: folder,
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto' },
          { format: 'webp' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(file.buffer);
  });
};

exports.deleteImage = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};