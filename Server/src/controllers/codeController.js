const dotenv = require("dotenv");
const axios = require("axios");
const languagesId = require("../lib/languagesID");
const testCases = require("../sample_test_cases.json");

// Load .env file
dotenv.config();

class codeController {
  // [POST] Make the code submission
  async codeSubmission(req, res) {
    const { code, language } = req.body;
    const language_id = languagesId[language.toLowerCase()];

    // Check if there is no language supported by Judge0
    if (!language_id) {
      return res.status(400).json({ error: "Unsupported language" });
    }

    // Define a function to Base64 encode using Buffer
    const base64encode = (data) => Buffer.from(data).toString("base64");

    // Store submission tokens to retrieve results later
    const submissionTokens = [];

    // Sending data's details with each test case
    for (const testCase of testCases) {
      // Define sending data's details
      const codeData = {
        method: "POST",
        url: `https://${process.env.JUDGE0_HOSTNAME}/submissions`,
        params: {
          base64_encoded: "true",
          wait: "false",
          fields: "*",
        },
        headers: {
          "x-rapidapi-key": `${process.env.JUDGE0_RAPIDAPI_KEY}`,
          "x-rapidapi-host": `${process.env.JUDGE0_HOSTNAME}`,
          "Content-Type": "application/json",
        },
        data: {
          language_id: language_id,
          source_code: base64encode(code),
          stdin: base64encode(testCase.input),
        },
      };

      // Send code to Judge0 for compilation and execution
      try {
        const Judge0Response = await axios.request(codeData);
        const resultId = Judge0Response.data.token;
        submissionTokens.push(resultId); // Collecting tokens for results fetching
      } 
      catch (error) {
        console.error("Error submitting code to Judge0:", error);
        return res
          .status(500)
          .json({ error: "Error submitting code to Judge0" });
      }
    }
    // Send tokens back to the front-end for fetching results
    res.json({ tokens: submissionTokens });
  }

  // [GET] Fetch the feedback from Judge0
  async fetchResults(req, res) {
    const { tokens } = req.query;

    if (!tokens) {
      return res.status(400).json({ error: "No tokens provided" });
    }

    // Make sure tokens are in an array format
    const tokenArray = Array.isArray(tokens) ? tokens : [tokens];
    const results = [];

    for (const token of tokenArray) {
      const codeData = {
        method: "GET",
        url: `https://${process.env.JUDGE0_HOSTNAME}/submissions/${token}`,
        params: {
          base64_encoded: "true",
          fields: "*",
        },
        headers: {
          "x-rapidapi-key": `${process.env.JUDGE0_RAPIDAPI_KEY}`,
          "x-rapidapi-host": `${process.env.JUDGE0_HOSTNAME}`,
        },
      };

      try {
        const Judge0Response = await axios.request(codeData);
        results.push(Judge0Response.data);
      } 
      catch (error) {
        console.error("Error fetching code submission result:", error);
        results.push({ error: "Error fetching result", token });
      }

      // Send results back to the front-end
      res.json(results);
      console.log(results);
    }
  }
}

module.exports = new codeController();
