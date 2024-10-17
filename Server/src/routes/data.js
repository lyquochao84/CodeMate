const dataController = require("../controllers/dataController");

const express = require("express");
const router = express.Router();

// [GET] Recommendation List
router.get("/recommendation-list", dataController.getRecommendationList);

// [GET] General List
router.get("/general-list", dataController.getGeneralList);

// [GET] Problems

module.exports = router;
