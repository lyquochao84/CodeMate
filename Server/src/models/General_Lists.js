const mongoose = require("mongoose");

const generalListsSchema = new mongoose.Schema({
    name: String,
    type: String,
    image: String
});

const GeneralLists = mongoose.model("general_lists", generalListsSchema);

module.exports = GeneralLists;