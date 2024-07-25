const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const indexRouter = require("./routes/index");
const auth = require("./middlewares/auth");

if (process.env.NODE_ENV === "test") {
  app.use((req, res, next) => {
    req.user = {
      _id: "5d8b8592978f8bd833ca8133",
    };
    next();
  });
}

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch(console.error);

app.use(express.json());
app.use("/", indexRouter);
app.use(cors());
app.use(auth);

app.listen(PORT, () => {});
