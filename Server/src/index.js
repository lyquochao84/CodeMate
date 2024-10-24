const express = require("express");
const passport = require("passport");
const connectDB = require("./database/mogodb");
const route = require("./routes");
const logger = require("./middlewares/logger");
const cors = require("./middlewares/cors");
const cookieParser = require('./middlewares/cookieParser');
const configurePassport = require('./config/passport');
const insertProblems = require('./scripts/problems');
const insertRecommendationLists = require('./scripts/recommendationLists');
const insertGeneralLists = require('./scripts/generalLists');

const app = express();
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

// Insert problems/lists into the database
insertProblems(); 
insertRecommendationLists();
insertGeneralLists();

// Routes
app.use("/", route);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
