const express = require("express");
const router = express.Router();
const jwtValidate = require("../middleware/jwtValidate");
const { getAllArticle, addArticle, deleteArticle, commentArticle, updateArticle, getArticleByID} = require("../controllers/article")

router.get("/", getAllArticle);
router.post("/", jwtValidate, addArticle);
router.get("/:id", getArticleByID);
router.put("/edit/:id", jwtValidate, updateArticle);
router.delete("/delete/:id", jwtValidate, deleteArticle);
router.post("/comment/:id", jwtValidate, commentArticle);

module.exports = router;
