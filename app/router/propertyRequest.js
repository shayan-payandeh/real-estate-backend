const router = require('express').Router();
const expressAsyncHandler = require('express-async-handler');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const {
  PropertyRequestController,
} = require('../http/controllers/admin/propertyRequest/propertyRequest.controller');

const multerStorage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, 'app/uploads/');
  // },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const resizeImages = async (req, res, next) => {
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(600, 350)
        .toFile(`app/uploads/${file.filename}`);
    })
  );
  next();
};

const upload = multer({ storage: multerStorage, fileFilter }).array(
  'images',
  5
);

router.post(
  '/add',
  upload,
  resizeImages,
  expressAsyncHandler(PropertyRequestController.addNewPropertyRequest)
);

router.get(
  '/list',
  expressAsyncHandler(PropertyRequestController.getListOfPropertyRequests)
);

router.get(
  '/:id',
  expressAsyncHandler(PropertyRequestController.getPropertyRequestById)
);

module.exports = {
  propertyRequestRoutes: router,
};
