const express = require("express");
const cors = require("cors");
const globalErrorController = require("./middlewares/globalErrorHandler");
const linkRouter = require("./Router/createURL.route");
const { redirectOriginal } = require("./controller/link.controller");
const dashboardRouter = require("./Router/dashboard.route");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1/links", linkRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.get("/:code", redirectOriginal);
app.use((req, res, next) => {
  const error = new Error("Route unavailable / Not Found");
  error.statusCode = 404;
  next(error);
});

app.use(globalErrorController);

module.exports = app;
