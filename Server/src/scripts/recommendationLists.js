const fs = require("fs");
const RecommendationLists = require('../models/Recommendation_Lists');

const insertRecommendationLists = async () => {
    try {
        const data = fs.readFileSync("src/recommendation_lists.json", "utf8"); 
        const lists = JSON.parse(data);
        
        // Prevent insert duplicate into the database
        for (const list of lists) {
            const existingLists = await RecommendationLists.findOne({ list: list.list });

            if (!existingLists) {
                await Lists.create(list);
            }
        }
    }
    catch(error) {
        console.error(error);
    }
};

module.exports = insertRecommendationLists;