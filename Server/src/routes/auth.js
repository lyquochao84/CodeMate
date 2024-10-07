const authController = require("../controllers/authController");

const express = require("express");
const router = express.Router();

// Register Route
router.post('/register', authController.register);

// Log In Route
router.post('/log-in', authController.logIn);

module.exports = router;