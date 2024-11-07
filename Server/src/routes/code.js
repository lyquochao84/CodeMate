const codeController = require("../controllers/codeController");

const express = require("express");
const router = express.Router();

// [POST] Code Submission
router.post("/submission", codeController.codeSubmission);

// [GET] Fetch code submission results
router.get("/submission/results", codeController.fetchResults);

module.exports = router;
