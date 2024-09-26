const express = require("express");
const connectDB = require("./database/mogodb");
const route = require("./routes");
const logger = require("./middlewares/logger");
const cors = require("./middlewares/cors");

const app = express();
const PORT = 5000;

// Connect to DB
connectDB();

// Middleware
app.use(logger);
app.use(cors);

// Convert body to json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", route);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
