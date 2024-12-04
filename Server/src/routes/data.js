const dataController = require("../controllers/dataController");

const express = require("express");
const router = express.Router();

// [GET] Recommendation List
router.get("/recommendation-list", dataController.getRecommendationList);

// [GET] General List
router.get("/general-list", dataController.getGeneralList);

// [GET] Problems
router.get("/problems", dataController.getProblems);

// [POST] Problems
router.post("/problems", dataController.filterProblemTitle);

// [GET] Search for problems
router.get("/search-problems", dataController.searchProblems);

module.exports = router;
