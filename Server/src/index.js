const express = require("express");

// Database
const connectDB = require("./database/mogodb");

// Route
const route = require("./routes");

// Middlewarers
const logger = require("./middlewares/logger");
const cors = require("./middlewares/cors");
const cookieParser = require('./middlewares/cookieParser');

const app = express();
const PORT = 5000;

// Connect to DB
connectDB();

// Convert body to json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(logger);
app.use(cors);
app.use(cookieParser);

// Routes
app.use("/", route);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
