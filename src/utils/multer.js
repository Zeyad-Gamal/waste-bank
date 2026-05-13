const multer = require('multer');

const path = require('path');

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    if (file.fieldname === 'national_id_image') {

      cb(null, 'uploads/national_ids');

    } else if (file.fieldname === 'proof_image') {

      cb(null, 'uploads/proofs');

    } else if (file.fieldname === 'factory_image') {

      cb(null, 'uploads/factories');

    } else {

      cb(new Error('Invalid file field'));

    }

  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);

  },

});

const fileFilter = (req, file, cb) => {

  const allowedTypes = /jpg|jpeg|png/;

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {

    return cb(null, true);

  }

  cb(new Error('Only images are allowed'));

};

const upload = multer({

  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

});

module.exports = upload;