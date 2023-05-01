const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongodb = require("mongodb");
require("dotenv").config();
app.use(cors());
const { MongoClient } = require("mongodb");
let ObjectId = require("mongodb").ObjectId;

app.use(express.json());

const mongoClient = mongodb.MongoClient;
const dbName = "db-name";
const userCollectionName = "users";

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!(email && password && name)) {
      return res.status(400).send("All input is required");
    }
    const client = await mongoClient.connect(
      "mongodb+srv://admin:admin@madoo.kljytni.mongodb.net/?retryWrites=true&w=majority"
    );
    const db = client.db(dbName);
    const userCollection = db.collection(userCollectionName);
    const oldUser = await userCollection.findOne({ email });
    if (oldUser) {
      client.close();
      return res.status(409).send("User already exists. Please login");
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      image:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1143&q=80",
    };
    const result = await userCollection.insertOne(newUser);
    const access_token = jwt.sign(
      { user_id: result.insertedId, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "2h",
        algorithm: "HS256",
      }
    );
    const refresh_token = jwt.sign(
      { user_id: result.insertedId, email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d", algorithm: "HS256" }
    );
    newUser.accesstoken = access_token;
    newUser.refreshtoken = refresh_token;
    client.close();
    return res.status(201).json(newUser);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }
    const client = await mongoClient.connect(
      "mongodb+srv://admin:admin@madoo.kljytni.mongodb.net/?retryWrites=true&w=majority"
    );
    const db = client.db(dbName);
    const userCollection = db.collection(userCollectionName);
    const user = await userCollection.findOne({ email });
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
      user.accesstoken = access_token;
      user.refreshtoken = refresh_token;
      client.close();
      return res.status(200).json(user);
    }
    client.close();
    return res.status(400).send("Invalid credentials");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
});
// Middleware for JWT authentication
const jwtValidate = (req, res, next) => {
  try {
    if (!req.headers["authorization"]) return res.sendStatus(401);

    const token = req.headers["authorization"].replace("Bearer ", "");

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) throw new Error(error);
    });
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
};
// Welcome
app.get("/welcome", jwtValidate, (req, res) => {
  res.status(200).send(`Welcome`);
});

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

app.post("/api/addArticle", async (req, res) => {
  const article = req.body;
  const timestamp = new Date();
  const client = new MongoClient(
    "mongodb+srv://admin:admin@madoo.kljytni.mongodb.net/?retryWrites=true&w=majority"
  );
  try {
    await client.connect();
    await client.db("db-name").collection("articleData").insertOne({
      title: article.title,
      content: article.content,
      user_email: article.user_email,
      timestamp: timestamp,
      user_name: article.user_name,
      user_img: article.user_img,
    });

    res.status(200).send({
      status: "ok",
      massage: "Article with ID = " + article.id + "is created",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
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

app.delete("/api/article/:id", async (req, res) => {
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
      .deleteOne({ _id: o_id });
    if (article) {
      res.status(200).send({ message: "Article" + id + "is deleted" });
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

// Start the server
app.listen(5000, () => console.log("Server started on port 5000"));
