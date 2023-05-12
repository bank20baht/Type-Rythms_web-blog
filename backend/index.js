require("dotenv").config();
const morgan = require("morgan");
const connection = require("./db");
const express = require("express");
const app = express();
const auth = require("./routes/auth");
const articles = require("./routes/articles");
const user = require("./routes/user")
const upload = require("./routes/upload")
const cors = require("cors");
const compression = require("compression");
const fs = require("fs");
const path = require("path");

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

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "/access.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'images')));
app.use("/api/auth", auth);
app.use("/api/articles", articles);
app.use("/api/user", user)
app.use("/api/upload", upload)

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
