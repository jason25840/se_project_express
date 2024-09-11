require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const indexRouter = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");

const {
  errorLogger,
  requestLogger,
  generalLogger,
} = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(requestLogger);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    generalLogger.info("Connected to MongoDB");
  })
  .catch((err) => {
    generalLogger.error("Failed to connect to MongoDB", err);
  });

app.use(cors());
app.use(express.json());

app.use("/", indexRouter);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  generalLogger.info(`Server is running on port ${PORT}`);
});
