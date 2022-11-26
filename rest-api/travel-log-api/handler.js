const serverless = require("serverless-http");
const express = require("express");
var bodyParser = require('body-parser')

// Set up app
const app = express();

// Middleware
app.use(bodyParser.json());
var cors = require('cors');
app.use(cors());

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

// Utils
const { connectDb } = require('./utils/db');

// Routes
// Base route
app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello World"
  });
});

// Auth routes
// /auth/signup
app.post("/auth/signup", authRoutes.signup);

// /auth/signin
app.post("/auth/signin", authRoutes.signin);

// User routes
// /user/:uid/add-place
app.post("/user/:uid/add-place", userRoutes.addPlace);

// /user/:uid
app.get("/user/:uid", userRoutes.getUser);

// /user/:uid/delete-place
app.post("/user/:uid/delete-place", userRoutes.deletePlace);

// 404 Error Handler
app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
