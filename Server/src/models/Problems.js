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
});

const Problem = mongoose.model("Problems", problemSchema);

module.exports = Problem;
