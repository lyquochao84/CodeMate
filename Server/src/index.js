// require("dotenv").config(); // Load .env file once, globally
const express = require("express");
const mongodb = require("./database/mogodb");
const route = require("./routes");
const logger = require("./middlewares/logger");
const cors = require("./middlewares/cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(logger);
app.use(cors);

// Convert body to json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", route);

// Start the server only when the database connection is successful
mongodb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  })

