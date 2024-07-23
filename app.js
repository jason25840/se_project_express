const express = require("express");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
const cors = require("cors");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch(console.error);

app.use(express.json());
app.use("/", indexRouter);
app.use(cors());

app.listen(PORT, () => {});
