const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config()
// Register
router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { name, email, password } = req.body;

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send("User already exists. Please login");
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });
    const result = await newUser.save();
    const access_token = jwt.sign(
      { user_id: result._id, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "2h",
        algorithm: "HS256",
      }
    );
    const refresh_token = jwt.sign(
      { user_id: result._id, email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d", algorithm: "HS256" }
    );
    const user = {
      name,
      email: email.toLowerCase(),
      image:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1143&q=80",
      accesstoken: access_token,
      refreshtoken: refresh_token,
    };
    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
});
module.exports = router;
