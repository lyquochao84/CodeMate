const cors = require("cors");

// Load .env file
const dotenv = require("dotenv");
dotenv.config();

const corsOptions = {
  origin: process.env.CLIENT_PRODUCTION,
  credentials: true, // Allow cookies
};

module.exports = cors(corsOptions); 
