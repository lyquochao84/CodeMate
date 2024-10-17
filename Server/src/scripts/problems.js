const fs = require("fs");
const Problem = require('../models/Problems');

const insertProblems = async () => {
    try {
        const data = fs.readFileSync("src/problems.json", "utf8"); 
        const problems = JSON.parse(data);

        // Prevent insert duplicate into the database
        for (const problem of problems) {
            const existingProblems = await Problem.findOne({ title: problem.title });

            if (!existingProblems) {
                await Problem.create(problem);
            }
        }
    }
    catch(error) {
        console.error("Error inserting problems", error);
    }
};

module.exports = insertProblems;

