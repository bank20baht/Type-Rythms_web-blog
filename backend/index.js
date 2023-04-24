const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const { MongoClient } = require("mongodb");

app.get("/api/articles", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const client = new MongoClient(
    "mongodb+srv://admin:admin@madoo.kljytni.mongodb.net/?retryWrites=true&w=majority"
  );
  try {
    await client.connect();
    //console.log("DB Connected");
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
    const count = await articlesCollection.countDocuments({ user_name: name }, (err, count) => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: "Internal server error" });
      } else {
        console.log(count); // should output the total number of documents that match the filter
        // rest of your code
      }
    });
    
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


// Start the server
app.listen(5000, () => console.log("Server started on port 5000"));
