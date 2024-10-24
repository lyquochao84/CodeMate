const mongoose = require("mongoose");

const generalListsSchema = new mongoose.Schema({
    list: String,
    type: String,
    image: String
});

const GeneralLists = mongoose.model("general_lists", generalListsSchema);

module.exports = GeneralLists;