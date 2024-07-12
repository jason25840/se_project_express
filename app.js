const express = require("express");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
const clothingItemRouter = require("./routes/clothingItems");
const userRouter = require("./routes/users");
const path = require("path");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(console.error);

app.use(express.json());
app.use("/", indexRouter);
app.use("/clothingItems", clothingItemRouter);
app.use("/users", userRouter);
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
