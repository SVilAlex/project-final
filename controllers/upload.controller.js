const UserModel = require('../models/user.model');
const fs = require('fs');
const { promisify } = require('util');
// const pipeline = promisify(require('stream').pipeline);
// const { uploadErrors } = require('../utils/errors.utils');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const multer = require('multer');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

module.exports.uploadUserPhoto = upload.single('photo');

module.exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  console.log(req.file);

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`client/public/uploads/profil/${req.file.originalname}`);

  try {
    await UserModel.findByIdAndUpdate(
      req.body.userId,
      {
        $set: {
          picture: `/uploads/profil/${req.file.originalname}`,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(500).send({ message: 'error 😅' });
      }
    );
  } catch (err) {
    return res.status(500).send({ message: 'error 😇' });
  }
});
