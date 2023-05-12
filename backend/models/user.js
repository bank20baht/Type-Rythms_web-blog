const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt")
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "http://localhost:5000/images/default-avatar-img.png",
    }, 
    refreshtoken: {
        type: String,
    }
});

userSchema.pre('save', async function (next) {
    try {
      if (!this.isModified('password')) return next();
  
      const hash = await bcrypt.hash(this.password, 10);
      this.password = hash;
      return next();
    } catch (err) {
      return next(err);
    }
  });

const User = mongoose.model("user", userSchema);

const validate = (user) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });
    return schema.validate(user);
};

module.exports = { User, validate };