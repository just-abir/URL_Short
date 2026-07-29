const express = require("express");
const cors = require("cors");
const globalErrorController = require("./middlewares/globalErrorHandler");
const linkRouter = require("./Router/createURL.route");
const { redirectOriginal } = require("./controller/link.controller");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/links", linkRouter);
app.get("/:code", redirectOriginal);
app.use((req, res, next) => {
  const error = new Error("Route unavailable / Not Found");
  error.statusCode = 404;
  next(error);
});

app.use(globalErrorController);

module.exports = app;
