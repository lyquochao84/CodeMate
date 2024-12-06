const cors = require("cors");

// Load .env file
const dotenv = require("dotenv");
dotenv.config();

const corsOptions = {
  origin: process.env.NEXT_PUBLIC_CLIENT_PRODUCTION,
  credentials: true, // Allow cookies
};

module.exports = cors(corsOptions); 
