const fs = require("fs");
const GeneralLists = require("../models/General_Lists");

const insertGeneralLists = async () => {
    try {
        const data = fs.readFileSync("src/general_lists.json", "utf-8");
        const generalLists = JSON.parse(data);

        for (const list of generalLists) {
            const existingGeneralList = await GeneralLists.findOne({ name: list.name });

            if (!existingGeneralList) {
                await GeneralLists.create(generalLists);
            }
        }
    }
    catch(error) {
        console.error(error);
    }
};

module.exports = insertGeneralLists;