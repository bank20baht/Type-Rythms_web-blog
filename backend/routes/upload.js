const express = require("express");
const router = express.Router();
const { upload_img, updateAvatar } = require("../controllers/upload")
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './images')
    },
    filename: function (req, file, callback) {
      callback(null, file.originalname)
    },
  })
  
  const upload = multer({ storage })
  
router.post("/upload",upload.single('photo'), upload_img)

module.exports = router