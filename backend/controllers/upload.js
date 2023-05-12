const { User } = require('../models/user')

const upload_img = async (req, res) => {
    const { filename,  } = req.file
    console.log(filename)
    res.status(200).send('upload finish')
  }

const updateAvatar = async (req, res) => {
    const { filename } = req.file
    const user = await User.find({ name: req.params.id}).updateOne({
        $set: {
            image: "http://localhost:8000/images//" + filename,
        }
    })
}


module.exports = {upload_img, updateAvatar}