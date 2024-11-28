const authRouter = require("./auth");
const dataRouter = require("./data");
const codeRouter = require("./code");
const roomRouter = require("./room");

const express = require("express");
const router = express.Router();

// Authentication
router.use("/auth", authRouter);

// Data (Problems & Lists)
router.use("/data", dataRouter);

// Handle Code
router.use("/code", codeRouter);

// Room
router.use("/room", roomRouter);

module.exports = router;