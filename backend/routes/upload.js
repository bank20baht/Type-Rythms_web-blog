const express = require("express");
const router = express.Router();
const { getAllimage, upload_img } = require("../controllers/upload")
const {upload} = require("../middleware/upfilemiddleware")

router.get("/images", getAllimage)
router.post("/upload",upload.single('photo'), upload_img)

module.exports = router