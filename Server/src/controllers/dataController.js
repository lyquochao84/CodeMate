const Problems = require("../models/Problems");
const GeneralLists = require("../models/General_Lists");
const RecommendationLists = require("../models/Recommendation_Lists");

class dataController {
  // [GET] Recommendation Lists
  async getRecommendationList(req, res) {
    try {
        const recommendationLists = await RecommendationLists.find();
        res.status(200).json(recommendationLists);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // [GET] General Lists
  async getGeneralList(req, res) {
    try {
        const generalLists = await GeneralLists.find();
        res.status(200).json(generalLists);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = new dataController();
