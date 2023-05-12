
const mongoose = require('mongoose')
const { User } = require('../models/user')

const upload_img = async (req, res) => {
    const { filename } = req.file
    console.log(filename)
    res.status(200).send('upload finish')
  }

const getAllimage = async (req, res) => {
    try {
      const images = await File.find({ name: { $regex: /\.(jpg|jpeg|png|gif)$/i } })
      res.send(images)
    } catch (err) {
      console.log(err)
      res.status(500).send('Error retrieving images')
    }
  }

module.exports = {upload_img, getAllimage}