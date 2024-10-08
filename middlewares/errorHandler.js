const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500 ? "An error occured on the server" : err.message;

  if (res.headersSent) {
    return next(err);
  }

  res.status(statusCode).send({ message });

  return next();
};

module.exports = errorHandler;
