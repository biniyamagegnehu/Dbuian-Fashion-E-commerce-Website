// backend/routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadImage, deleteImage } = require('../utils/cloudinary');
const { serveMockImage } = require('../utils/cloudinary');


const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Simple error handling
const handleMulterError = (error, req, res, next) => {
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  next();
};

// @desc    Upload single image
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, authorize('admin'), upload.single('image'), handleMulterError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    console.log('Uploading image:', req.file.originalname);

    const result = await uploadImage(req.file, 'dbuian_fashion/products');

    console.log('Upload successful:', result.secure_url);

    res.status(200).json({
      success: true,
      data: {
        image: {
          url: result.secure_url,
          public_id: result.public_id
        }
      }
    });
    
  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Upload failed. Please try again.'
    });
  }
});

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private/Admin
router.post('/multiple', protect, authorize('admin'), upload.array('images', 10), handleMulterError, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload image files'
      });
    }

    console.log(`Uploading ${req.files.length} images`);

    const uploadPromises = req.files.map(async (file) => {
      try {
        const result = await uploadImage(file, 'dbuian_fashion/products');
        return {
          success: true,
          image: {
            url: result.secure_url,
            public_id: result.public_id
          }
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
          filename: file.originalname
        };
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter(result => result.success);

    res.status(200).json({
      success: true,
      data: {
        uploaded: successfulUploads.map(result => result.image)
      },
      message: `Successfully uploaded ${successfulUploads.length} images`
    });
    
  } catch (error) {
    console.error('Multiple upload error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Upload failed. Please try again.'
    });
  }
});

// @desc    Delete image
// @route   DELETE /api/upload/:publicId
// @access  Private/Admin
router.delete('/:publicId', protect, authorize('admin'), async (req, res) => {
  try {
    const { publicId } = req.params;

    await deleteImage(publicId);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Delete failed. Please try again.'
    });
  }
});

router.get('/mock-images/:filename', serveMockImage);

module.exports = router;