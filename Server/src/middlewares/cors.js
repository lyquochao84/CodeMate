const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, // Allow cookies
};

module.exports = cors(corsOptions); 
