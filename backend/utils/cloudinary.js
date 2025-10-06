import cloudinary from '../config/cloudinary.js';

const uploadImage = async (buffer, folder = 'campusmart') => {
  try {
    console.log('Uploading image to Cloudinary, buffer size:', buffer.length);
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: folder,
          quality: 'auto',
          fetch_format: 'auto'
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload success:', result.public_id);
            resolve({
              url: result.secure_url,
              publicId: result.public_id
            });
          }
        }
      ).end(buffer);
    });
  } catch (error) {
    console.error('Upload image error:', error);
    throw new Error(`Image upload failed: ${error.message || error}`);
  }
};

const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Image deletion failed: ${error.message}`);
  }
};

const uploadMultipleImages = async (files, folder = 'campusmart') => {
  try {
    console.log('Uploading files:', files.length);
    const uploadPromises = files.map((file, index) => {
      console.log(`File ${index}:`, file.originalname, file.mimetype, file.size);
      return uploadImage(file.buffer, folder);
    });
    const results = await Promise.all(uploadPromises);
    console.log('Upload results:', results.length);
    return results;
  } catch (error) {
    console.error('Multiple image upload error:', error);
    throw new Error(`Multiple image upload failed: ${error.message || error}`);
  }
};

export {
  uploadImage,
  deleteImage,
  uploadMultipleImages
};