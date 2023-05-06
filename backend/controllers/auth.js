const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { generateTokens } = require('../controllers/generateTokens');
const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
          return res.status(400).send("All input is required");
        }
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
          const tokens = generateTokens(user);
          await user.save();
          return res.status(200).json({
              name: user.name,
              email: user.email,
              password: user.password,
              image: user.image,
              accesstoken: tokens.accessToken,
              refreshtoken: tokens.refreshToken
          });
        }
        return res.status(400).send("Invalid credentials");
      } catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
      }
};

const register = async (req, res) => {
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
  };

const refresh = async (req, res, next) => {
    try {
        const oldUser = await User.findOne({ email: req.user.email });
        if (!oldUser) {
          return res.sendStatus(401);
        }
        const oldRefreshToken = oldUser.refreshtoken;
        const newTokens = generateTokens(oldUser);
    
        // Check if the old refresh token is valid before updating it
        const isValidRefreshToken = jwt.verify(
          oldRefreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
        if (!isValidRefreshToken) {
          return res.sendStatus(401);
        }
    
        oldUser.refreshtoken = newTokens.refreshToken;
        const savedUser = await oldUser.save();
    
        const user = {
          name: savedUser.name,
          email: savedUser.email,
          image:
            "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1143&q=80",
          accesstoken: newTokens.accessToken,
          refreshtoken: newTokens.refreshToken,
        };
        return res.status(201).json(user);
      } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
      }
};

const validate_login = (user) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });
    return schema.validate(user);
};

module.exports = {login, refresh, register}