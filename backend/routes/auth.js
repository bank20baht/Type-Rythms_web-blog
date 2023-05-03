const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")

router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!(email && password)) {
        return res.status(400).send("All input is required");
      }
      const user = await User.findOne({ email });
      if (user && (await bcrypt.compare(password, user.password))) {
        const access_token = jwt.sign(
          { user_id: user._id, email },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "2h",
            algorithm: "HS256",
          }
        );
        const refresh_token = jwt.sign(
          { user_id: user._id, email },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d", algorithm: "HS256" }
        );
        await user.save();
        return res.status(200).json({
            name: user.name,
            email: user.email,
            password: user.password,
            image: user.image,
            accesstoken: access_token,
            refreshtoken: refresh_token
        });
      }
      return res.status(400).send("Invalid credentials");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Internal server error");
    }
  });

const validate = (user) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });
    return schema.validate(user);
};

module.exports = router;