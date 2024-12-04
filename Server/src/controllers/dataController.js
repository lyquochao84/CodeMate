const Problems = require("../models/Problems");
const GeneralLists = require("../models/General_Lists");
const RecommendationLists = require("../models/Recommendation_Lists");

class dataController {
  // [GET] Recommendation Lists
  async getRecommendationList(req, res) {
    try {
      const recommendationLists = await RecommendationLists.find();
      res.status(200).json(recommendationLists);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // [GET] General Lists
  async getGeneralList(req, res) {
    try {
      const generalLists = await GeneralLists.find();
      res.status(200).json(generalLists);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // [GET] Problems
  async getProblems(req, res) {
    try {
      const problemsList = await Problems.find();
      res.status(200).json(problemsList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // [POST] Filter problem's title
  async filterProblemTitle(req, res) {
    const { title } = req.body;

    try {
      // Creates a regular expression that matches title in a case-insensitive way
      const problem = await Problems.findOne({
        title: new RegExp(`^${title}$`, "i"),
      });

      if (problem) {
        res.json({ problem });
      } 
      else {
        res.status(404).json({ message: "Problem not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // [GET] Search for problems
  async searchProblems(req, res) {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: "Query is required." });
    }

    try {
      const results = await Problems.find({
        title: { $regex: query, $options: "i" }, // Case-insensitive regex
      }).select("title"); // Only return the title field

      res.status(200).json(results);
    } 
    catch (error) {
      res.status(500).json({ message: "Error searching for problems", error });
    }
  }
}

module.exports = new dataController();
