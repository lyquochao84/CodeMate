const http = require("http");
const express = require("express");

const passport = require("passport");
const route = require("./routes");

const connectDB = require("./database/mogodb");

const logger = require("./middlewares/logger");
const cors = require("./middlewares/cors");
const cookieParser = require('./middlewares/cookieParser');

const setupSocketIO  = require("./config/socket_io");
const configurePassport = require('./config/passport');

const insertProblems = require('./scripts/problems');
const insertRecommendationLists = require('./scripts/recommendationLists');
const insertGeneralLists = require('./scripts/generalLists');

const app = express();
const server = http.createServer(app);
const io = setupSocketIO(server);
const PORT = 5000;

// Connect to DB
connectDB();

// Convert body to json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlewares
app.use(logger);
app.use(cors);
app.use(cookieParser);

// Passport middleware
app.use(passport.initialize());

// Import the configuration of passport
configurePassport();

// Scripts to insert problems/lists into the database
insertProblems(); 
insertRecommendationLists();
insertGeneralLists();

// Routes
app.use("/", route);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
