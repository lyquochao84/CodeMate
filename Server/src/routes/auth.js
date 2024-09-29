const authController = require("../controllers/authController");

const express = require("express");
const router = express.Router();

// Sign Up Route
router.post('/register', authController.register);

// Sign In Route
router.post('/sign-in', authController.logIn);

module.exports = router;