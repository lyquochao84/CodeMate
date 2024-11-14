const express = require("express");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ['GET', 'POST'],
    credentials: true, // Allow cookies
  })
);

module.exports = app;
