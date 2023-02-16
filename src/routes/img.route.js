const express = require('express');
const router = express.Router();
const images = require('../controllers/imageUpload');
const auth = require('../middleware/authdriver.middleware');;
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    req.body.file = `${file.fieldname}` + Date.now() + '-' + Math.round(Math.random() * 1E9) + `${path.extname(file.originalname)}`
    cb(null, req.body.file)
  }
})

const upload = multer({
  storage
}).single('img')

router.post('/img', auth(), upload, awaitHandlerFactory(images.imgCreate));
router.get('/one', awaitHandlerFactory(images.one));
module.exports = router;