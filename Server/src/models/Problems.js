const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: String,
  tags: [String],
  company: [String],
  lists: [String],
  examples: [
    {
      input: String,
      output: String,
      explanation: {
        type: String,
        required: false,
      },
    },
  ],
  testCases: [
    {
      input: {
        type: mongoose.Schema.Types.Mixed, 
        required: true,
      },
      output: {
        type: mongoose.Schema.Types.Mixed, 
        required: true,
      },
    },
  ],
});

const Problem = mongoose.model("Problems", problemSchema);

module.exports = Problem;
