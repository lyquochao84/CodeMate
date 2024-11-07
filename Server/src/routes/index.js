const authRouter = require("./auth");
const dataRouter = require("./data");
const codeRouter = require("./code");

const express = require("express");
const router = express.Router();

// Authentication
router.use("/auth", authRouter);

// Data (Problems & Lists)
router.use("/data", dataRouter);

// Handle Code
router.use("/code", codeRouter);

module.exports = router;