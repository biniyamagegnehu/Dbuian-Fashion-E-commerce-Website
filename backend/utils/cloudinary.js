// backend/utils/cloudinary.js
const cloudinary = require('../config/cloudinary');
const path = require('path');
const fs = require('fs');

// Create a temporary storage directory for mock uploads
const mockStorageDir = path.join(__dirname, '../temp_uploads');
if (!fs.existsSync(mockStorageDir)) {
  fs.mkdirSync(mockStorageDir, { recursive: true });
}

// Mock upload function that stores actual images
const mockUploadImage = async (file, folder = 'dbuian_fashion') => {
  console.log('Using mock upload for:', file.originalname);
  
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate a unique filename
  const fileExtension = path.extname(file.originalname) || '.jpg';
  const uniqueFilename = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}${fileExtension}`;
  const filePath = path.join(mockStorageDir, uniqueFilename);
  
  // Save the actual file to temporary storage
  fs.writeFileSync(filePath, file.buffer);
  
  // Create a mock Cloudinary response
  const mockResponse = {
    secure_url: `/api/mock-images/${uniqueFilename}`, // Serve through an API endpoint
    public_id: `mock_${uniqueFilename}`,
    bytes: file.size,
    format: file.mimetype.split('/')[1] || 'jpg',
    width: 800,
    height: 800,
    resource_type: 'image',
    original_filename: file.originalname
  };
  
  console.log('Mock upload successful, file saved:', filePath);
  return mockResponse;
};

// Mock delete function
const mockDeleteImage = async (publicId) => {
  console.log('Mock deleting image:', publicId);
  
  // Extract filename from public_id
  const filename = publicId.replace('mock_', '');
  const filePath = path.join(mockStorageDir, filename);
  
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('Mock file deleted:', filePath);
    }
  } catch (error) {
    console.log('Error deleting mock file:', error.message);
  }
  
  await new Promise(resolve => setTimeout(resolve, 300));
  return { result: 'ok' };
};

// Serve mock images through an API endpoint
exports.serveMockImage = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(mockStorageDir, filename);
  
  if (fs.existsSync(filePath)) {
    // Determine content type
    const ext = path.extname(filename).toLowerCase();
    const contentTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };
    
    res.setHeader('Content-Type', contentTypes[ext] || 'image/jpeg');
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
};

// Main upload function
exports.uploadImage = async (file, folder = 'dbuian_fashion') => {
  try {
    // Check if Cloudinary is properly configured
    if (process.env.CLOUDINARY_CLOUD_NAME && 
        process.env.CLOUDINARY_API_KEY && 
        process.env.CLOUDINARY_API_SECRET &&
        process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_cloud_name') {
      
      console.log('Attempting real Cloudinary upload...');
      
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { 
            resource_type: 'image',
            folder: folder,
            transformation: [
              { width: 800, height: 800, crop: 'limit' },
              { quality: 'auto' },
              { format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload failed, using mock:', error.message);
              // Fallback to mock upload
              mockUploadImage(file, folder).then(resolve).catch(reject);
            } else {
              console.log('Cloudinary upload successful');
              resolve(result);
            }
          }
        ).end(file.buffer);
      });
      
    } else {
      console.log('Cloudinary not configured, using mock upload');
      return mockUploadImage(file, folder);
    }
    
  } catch (error) {
    console.log('Upload error, using mock:', error.message);
    return mockUploadImage(file, folder);
  }
};

exports.deleteImage = async (publicId) => {
  try {
    if (process.env.CLOUDINARY_CLOUD_NAME && 
        process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_cloud_name' &&
        !publicId.startsWith('mock_')) {
      return await cloudinary.uploader.destroy(publicId);
    } else {
      return mockDeleteImage(publicId);
    }
  } catch (error) {
    console.log('Delete failed, using mock:', error.message);
    return mockDeleteImage(publicId);
  }
};