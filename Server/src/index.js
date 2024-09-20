const express = require("express");
const app = express();
const PORT = 5000;

// Server Port
app.listen(PORT, () => {
    console.log(`Server start on ${PORT}`)
});