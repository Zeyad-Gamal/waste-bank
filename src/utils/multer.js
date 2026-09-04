// const multer = require('multer');

// const path = require('path');

// const storage = multer.diskStorage({

//   destination: (req, file, cb) => {

//     if (file.fieldname === 'national_id_image') {

//       cb(null, 'uploads/national_ids');

//     } else if (file.fieldname === 'proof_image') {

//       cb(null, 'uploads/proofs');

//     } else if (file.fieldname === 'factory_image') {

//       cb(null, 'uploads/factories');

//     } else {

//       cb(new Error('Invalid file field'));

//     }

//   },

//   filename: (req, file, cb) => {

//     const uniqueName =
//       Date.now() +
//       '-' +
//       Math.round(Math.random() * 1e9) +
//       path.extname(file.originalname);

//     cb(null, uniqueName);

//   },

// });

// const fileFilter = (req, file, cb) => {

//   const allowedTypes = /jpg|jpeg|png/;

//   const extname = allowedTypes.test(
//     path.extname(file.originalname).toLowerCase()
//   );

//   const mimetype = allowedTypes.test(file.mimetype);

//   if (extname && mimetype) {

//     return cb(null, true);

//   }

//   cb(new Error('Only images are allowed'));

// };

// const upload = multer({

//   storage,

//   fileFilter,

//   limits: {
//     fileSize: 5 * 1024 * 1024,
//   },

// });

// module.exports = upload;


// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     let uploadPath = '';

//     if (file.fieldname === 'national_id_image') {
//       uploadPath = 'uploads/national_ids';
//     } else if (file.fieldname === 'proof_image') {
//       uploadPath = 'uploads/proofs';
//     } else if (file.fieldname === 'factory_image') {
//       uploadPath = 'uploads/factories';
//     } else if (file.fieldname === 'offer_images') {
//       uploadPath = 'uploads/offers';
//     } else {
//       return cb(new Error('Invalid file field'));
//     }

//     // create folder if not exists
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }

//     cb(null, uploadPath);
//   },

//   filename: (req, file, cb) => {
//     const uniqueName =
//       Date.now() +
//       '-' +
//       Math.round(Math.random() * 1e9) +
//       path.extname(file.originalname);

//     cb(null, uniqueName);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpg|jpeg|png/;

//   const extname = allowedTypes.test(
//     path.extname(file.originalname).toLowerCase()
//   );

//   const mimetype = allowedTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     return cb(null, true);
//   }

//   cb(new Error('Only images are allowed'));
// };

// const upload = multer({
//   storage,
//   fileFilter,

//   limits: {
//     fileSize: 5 * 1024 * 1024,
//   },
// });

// module.exports = upload;




const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = '';

    switch (file.fieldname) {
      case 'national_id_image':
        uploadPath = 'uploads/national_ids';
        break;

      case 'proof_image':
        uploadPath = 'uploads/proofs';
        break;

      case 'factory_image':
        uploadPath = 'uploads/factories';
        break;

      case 'offer_images':
        uploadPath = 'uploads/offers';
        break;

      default:
        return cb(new Error('Invalid file field'));
    }

    // Create folder if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const uniqueName =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      extension;

    cb(null, uniqueName);
  },
});


/**
 * Accept image files
 */
const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  // Common image extensions
  const allowedExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.bmp',
    '.tiff',
    '.tif',
    '.svg',
    '.ico',
    '.avif',
    '.heic',
    '.heif',
  ];

  // Normal image MIME types
  const isImageMimeType = file.mimetype.startsWith('image/');

  // Some clients send images as application/octet-stream
  const isOctetStream =
    file.mimetype === 'application/octet-stream';

  console.log('========== UPLOAD DEBUG ==========');
  console.log('fieldname:', file.fieldname);
  console.log('originalname:', file.originalname);
  console.log('mimetype:', file.mimetype);
  console.log('extension:', extension);
  console.log('==================================');

  /*
   * Accept if:
   *
   * 1. MIME type is image/*
   *
   * OR
   *
   * 2. Client sends application/octet-stream
   *    but the file has a known image extension
   */
  if (
    isImageMimeType ||
    (isOctetStream && allowedExtensions.includes(extension))
  ) {
    return cb(null, true);
  }

  return cb(
    new Error('Only image files are allowed'),
    false
  );
};


const upload = multer({
  storage,

  fileFilter,

  limits: {
    // Maximum file size = 5 MB
    fileSize: 5 * 1024 * 1024,
  },
});


module.exports = upload;
