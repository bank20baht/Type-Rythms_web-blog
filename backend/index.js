require("dotenv").config();
const connection = require("./db");
const express = require("express");
const app = express();
const auth = require("./routes/auth");
const articles = require("./routes/articles");
const user = require("./routes/user")
const cors = require("cors");
const jwtValidate = require("./middleware/jwtValidate")
const compression = require("compression");

function shouldCompress(req, res) {
  if (req.headers["x-no-compression"]) {
    // don't compress responses if this request header is present
    return false;
  }
  // fallback to standard compression
  return compression.filter(req, res);
}

connection();
app.use(cors());
app.use(
  compression({
    filter: shouldCompress,
    threshold: 0,
  })
);
app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/articles", articles);
app.use("/api/user", user)

app.get("/welcome", jwtValidate, (req, res) => {
    const { user } = req;
    res.status(200).send(`Hello ${user.email}`);
  });

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
