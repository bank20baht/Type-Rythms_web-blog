const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();
const { generateTokens } = require("./generateTokens");

require("dotenv").config();
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

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: password,
    });
    const tokens = generateTokens(newUser);
    newUser.refreshtoken = tokens.refreshToken;
    const result = await newUser.save();

    const user = {
      name,
      email: email.toLowerCase(),
      image:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1143&q=80",
        accesstoken: tokens.accessToken,
        refreshtoken: tokens.refreshToken
    };
    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
});
module.exports = router;
