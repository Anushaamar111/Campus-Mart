import { v2 as cloudinary } from 'cloudinary';

let isConfigured = false;

// Configure Cloudinary with environment variables
const configureCloudinary = () => {
  if (isConfigured) return;
  
  const config = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  };
  
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Cloudinary configured successfully');
  }
  
  cloudinary.config(config);
  isConfigured = true;
};

// Create a proxy that ensures configuration before any operation
const cloudinaryProxy = new Proxy(cloudinary, {
  get(target, prop) {
    if (typeof target[prop] === 'object' && target[prop] !== null) {
      // For nested objects like uploader, admin, etc.
      return new Proxy(target[prop], {
        get(nestedTarget, nestedProp) {
          configureCloudinary(); // Ensure configuration before any operation
          return nestedTarget[nestedProp];
        }
      });
    }
    
    if (typeof target[prop] === 'function') {
      return function(...args) {
        configureCloudinary(); // Ensure configuration before any operation
        return target[prop].apply(target, args);
      };
    }
    
    return target[prop];
  }
});

export default cloudinaryProxy;