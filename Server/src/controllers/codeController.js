const dotenv = require("dotenv");
const axios = require("axios");
const languagesId = require("../lib/languagesID");
const Problem = require("../models/Problems");

// Load .env file
dotenv.config();

class codeController {
  // [POST] Make the code submission
  codeSubmission = async (req, res) => {
    const { code, language, title } = req.body;
    const language_id = languagesId[language.toLowerCase()];

    // Define the code submission details
    const options = {
      method: "POST",
      url: `https://${process.env.JUDGE0_HOSTNAME}/submissions`,
      params: {
        base64_encoded: "false",
        wait: "true",
        fields: "*",
      },
      headers: {
        "x-rapidapi-key": `${process.env.JUDGE0_RAPIDAPI_KEY}`,
        "x-rapidapi-host": `${process.env.JUDGE0_HOSTNAME}`,
        "Content-Type": "application/json",
      },
      data: {
        language_id: language_id,
        source_code: code,
      },
    };

    try {
      // Send the submission request to Judge0
      const response = await axios.request(options);
      let results = response.data;
     
      if (!results || !results.status || results.status.id <= 2) {
        throw new Error(`Judge0 API responded with status ${results.status}`);
      }

      // The result is still processing
      if (results.status.id <= 2) {
        results = await pollJudge0Result(results.token);
      }
      
      res.json(results);
    } 
    catch (error) {
      console.error("Error submitting code to Judge0:", error);
      res.status(500).json({ error: "Error submitting code to Judge0" });
    }
  };

  // Helper function to polling the result 
  pollJudge0Result = async (token) => {
    const getOptions = {
      method: 'GET',
      url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
      params: {
        base64_encoded: 'false',
      },
      headers: {
        "x-rapidapi-key": `${process.env.JUDGE0_RAPIDAPI_KEY}`,
        "x-rapidapi-host": `${process.env.JUDGE0_HOSTNAME}`,
      }
    };

    while (true) {
      try {
        const response = await axios.request(getOptions);
        const resultData = response.data;

        if (!resultData || !resultData.status) {
          throw new Error(`Invalid response from Judge0 API`);
        } 

        if (resultData.status.id > 2) {
          //i.e result is processed
          return resultData;
        } 
        else {
          await new Promise(resolve => setTimeout(resolve, 2000)); 
        }
      }
      catch(error) {
        console.error(`Error polling Judge0 API for token ${token}`, error);
        await new Promise(resolve => setTimeout(resolve, 2000)); 
      }
    }
  }
}

module.exports = new codeController();
