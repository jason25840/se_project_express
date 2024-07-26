const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const indexRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

//if (process.env.NODE_ENV === "test") {
//  app.use((req, res, next) => {
//    req.user = {
//      _id: "5d8b8592978f8bd833ca8133",
//    };
//    next();
//  });
//}

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

app.use(cors());
app.use(express.json());

//if (process.env.NODE_ENV !== "test") {
//  app.use(auth);
//}

app.use("/", indexRouter);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
