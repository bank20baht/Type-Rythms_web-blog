const { Article, validate } = require("../models/article");
const Joi = require("joi");

const getAllArticle = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const count = await Article.countDocuments();
    const articles = await Article.find({})
      .skip((page - 1) * limit)
      .limit(limit);
    if (articles.length > 0) {
      res.status(200).json({
        results: articles,
        count: count,
        totalPage: Math.ceil(count / limit),
        currentPage: page,
      });
    } else {
      res.status(404).send({ message: "No article in database" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

const addArticle = async (req, res, next) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    await Article.create(req.body);
    res.status(200).send({
      status: "ok",
      message: "Article is create.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

const getArticleByID = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (article) {
      res.status(200).send(article);
    } else {
      res.status(404).send({ message: "Article not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

const updateSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});

const updateArticle = async (req, res, next) => {
  try {
    //get email from accesstoken and get Article info to auth for delete
    const { user } = req;
    const verify_article = await Article.findById(req.params.id);
    if (verify_article.user_email == user.email) {
      const { error } = updateSchema.validate(req.body);
      if (error) {
        return res.status(400).send({ message: error.details[0].message });
      }
      const article = await Article.findByIdAndUpdate(req.params.id, {
        $set: {
          title: req.body.title,
          content: req.body.content,
        },
      });
      if (article) {
        res.status(200).send({
          status: "ok",
          message: "Article " + article.title + " is updated",
        });
      } else {
        res.status(404).send({ message: "Article not found" });
      }
    } else {
      res.status(401).send({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

const deleteArticle = async (req, res, next) => {
  try {
    const { user } = req;
    const verify_article = await Article.findById(req.params.id);
    if (verify_article.user_email == user.email) {
      const article = await Article.findByIdAndDelete(req.params.id);
      if (article) {
        res.status(200).send({
          status: "ok",
          message: "Article " + article.title + " is deleted",
        });
      } else {
        res.status(404).send({ message: "Article not found" });
      }
    } else {
      res.status(401).send({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

const commentArticle = async (req, res) => {
  try {
    await Article.findByIdAndUpdate(req.params.id, {
      $push: {
        comment: {
          picture: req.body.picture,
          username: req.body.username,
          comment: req.body.comment,
        },
      },
    });
    res.status(200).send({
      status: "ok",
      message: "Article is update",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};


module.exports = {
  getAllArticle,
  addArticle,
  deleteArticle,
  commentArticle,
  updateArticle,
  getArticleByID,
};
