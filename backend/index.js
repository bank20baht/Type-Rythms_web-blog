const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const { MongoClient } = require("mongodb");

let ObjectId = require("mongodb").ObjectId;
app.use(express.json());
app.get("/api/article/:id", async (req, res) => {
  let id = req.params.id;
  let o_id = new ObjectId(id);
  const client = new MongoClient(
    "mongodb+srv://admin:admin@madoo.kljytni.mongodb.net/?retryWrites=true&w=majority"
  );
  try {
    await client.connect();
    const article = await client
      .db("db-name")
      .collection("articleData")
      .find({ _id: o_id })
      .toArray(function (err, docs) {});
    //console.log(article)
    if (article) {
      res.status(200).send(article[0]);
    } else {
      res.status(404).send({ message: "Article not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  } finally {
    await client.close();
  }
});

app.post("/api/article/comment/:id", async (req, res) => {
  let id = req.params.id;
  let o_id = new ObjectId(id);
  const client = new MongoClient(
    "mongodb+srv://admin:admin@madoo.kljytni.mongodb.net/?retryWrites=true&w=majority"
  );
  try {
    await client.connect();
    const article = await client
      .db("db-name")
      .collection("articleData")
      .updateOne(
        { _id: o_id },
        {
          $push: {
            comment: {
              picture: req.body.picture,
              username: req.body.username,
              comment: req.body.comment,
            },
          },
        }
      );
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  } finally {
    await client.close();
  }
});

app.get("/api/articles", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const client = new MongoClient(
    "mongodb+srv://admin:admin@madoo.kljytni.mongodb.net/?retryWrites=true&w=majority"
  );
  try {
    await client.connect();
    const articlesCollection = client.db("db-name").collection("articleData");

    const count = await articlesCollection.countDocuments();
    const articles = await articlesCollection
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    res.status(200).json({
      results: articles,
      count: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  } finally {
    await client.close();
  }
});

app.get("/api/user/:id", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  let name = req.params.id;
  const client = new MongoClient(
    "mongodb+srv://admin:admin@madoo.kljytni.mongodb.net/?retryWrites=true&w=majority"
  );
  try {
    await client.connect();
    const articlesCollection = client.db("db-name").collection("articleData");
    const count = await articlesCollection.countDocuments(
      { user_name: name },
      (err, count) => {
        if (err) {
          console.error(err);
          res.status(500).send({ message: "Internal server error" });
        }
      }
    );

    const articles = await articlesCollection
      .find({ user_name: name })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    if (articles) {
      res.status(200).json({
        results: articles,
        count: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    } else {
      res.status(404).send({ message: "Articles not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  } finally {
    await client.close();
  }
});

app.put("/api/update/article", async (req, res) => {
  const article = req.body;
  let o_id = new ObjectId(article._id);
  const client = new MongoClient(
    "mongodb+srv://admin:admin@madoo.kljytni.mongodb.net/?retryWrites=true&w=majority"
  );
  try {
    await client.connect();
    await client
      .db("db-name")
      .collection("articleData")
      .updateOne(
        { _id: o_id },
        {
          $set: {
            title: article.title,
            content: article.content,
            name: article.name,
            email: article.email,
          },
        }
      );
    res.status(200).send({
      status: "ok",
      message: "Article with ID = " + " is updated",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  } finally {
    await client.close();
  }
});

// Start the server
app.listen(5000, () => console.log("Server started on port 5000"));
