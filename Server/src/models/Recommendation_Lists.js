const mongoose = require("mongoose");

const recommendationListsSchema = new mongoose.Schema({
    list: String,
    description: String,
    image: String
});

const RecommendationLists = mongoose.model("recommendation_lists", recommendationListsSchema);

module.exports = RecommendationLists;