const express = require("express")
const router = express.Router();
const { Article } = require("../models/article");

router.post("/", async (req, res) => {
    try {
        await Article.findByIdAndUpdate(req.params.id, {
            $push: {
                comment: {
                    picture: req.body.picture,
                    username: req.body.username,
                    comment: req.body.comment
                }
            }
        }) 
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
})


module.exports = router;