const authController = require("../controllers/authController");

const express = require("express");
const router = express.Router();

// [POST] Register Route
router.post("/register", authController.register);

// [POST] Log In Route
router.post("/log-in", authController.logIn);

// [GET] User's data
router.get("/user", authController.getUserData);

// [GET] GitHub Auth Route
router.get("/github", authController.githubAuth);

// [GET] GitHub Auth Callback Route
router.get("/github/callback", authController.githubCallback);

module.exports = router;
