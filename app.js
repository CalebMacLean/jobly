"use strict";

/** Express app for jobly. */
// Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
const express = require("express");
// CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
const cors = require("cors");

// ExpressError is a custom error class that takes a message and status code as arguments.
const { NotFoundError } = require("./expressError");

// Import middleware
const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const companiesRoutes = require("./routes/companies");
const usersRoutes = require("./routes/users");

// Morgan is a HTTP request logger middleware for node.js
const morgan = require("morgan");

// Create an Express application
const app = express();

// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/companies", companiesRoutes);
app.use("/users", usersRoutes);


/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  // conditional will prevent stack trace from showing in test
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
