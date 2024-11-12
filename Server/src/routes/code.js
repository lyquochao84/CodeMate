const codeController = require("../controllers/codeController");

const express = require("express");
const router = express.Router();

// [POST] Code Submission
router.post("/submission", codeController.codeSubmission);

module.exports = router;
