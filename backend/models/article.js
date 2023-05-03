const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const articleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  user_email: {
    type: String,
    require: true,
  },
  user_name: {
    type: String,
    required: true,
  },
  user_img: {
    type: String,
    required: true,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Article = mongoose.model("article", articleSchema);

const validate = (article) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    user_email: Joi.string().email().required(),
    user_name: Joi.string().required(),
    user_img: Joi.string().required(),
  });
  return schema.validate(article);
};

module.exports = { Article, validate };
