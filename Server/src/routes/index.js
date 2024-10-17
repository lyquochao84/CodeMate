const authRouter = require("./auth");
const dataRouter = require("./data");

const express = require("express");
const router = express.Router();

// Authentication
router.use("/auth", authRouter);

// Data (Problems & Lists)
router.use("/data", dataRouter);

module.exports = router;