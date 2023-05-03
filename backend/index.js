require("dotenv").config();
const connection = require("./db");
const express = require("express");
const app = express();
const register = require("./routes/registers");
const auth = require("./routes/auth");
const articles = require("./routes/articles");
const cors = require("cors");
const jwtValidate = require("./middleware/auth")

connection();
app.use(cors());
app.use(express.json());
app.use("/api/register", register);
app.use("/api/auth", auth);
app.use("/api/articles", articles);

// test
app.get("/welcome", jwtValidate, (req, res) => {
    const { user } = req;
    res.status(200).send(`Hello ${user.email}`);
  });

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
