// Import dotenv
require('dotenv').config({ path: './.env' });

// Import Express
const express = require('express');
// Import BodyParser
const bodyParser = require('body-parser');
// Import CORS
const cors = require('cors');
// Connect Database
require("./Database/db");

// Create App
const app = express();

// Get the Port
const port = process.env.PORT || 5000;

// Set up body-parser middleware to parse JSON and urlencoded data
// Increase Payload Size Limit
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Use CORS
app.use(cors());

// Import User Router
app.use("/api/user", require("./Controller/userController"));
// Import List Router
app.use("/api/list", require("./Controller/listController"));
// Import Task Router
app.use("/api/task", require("./Controller/taskController"));

app.all("*", (req, res) => {
    res.status(404).send("`~` Page Not Found `~`");
})

app.listen(port, () => {
    console.log(`Server Running at http://localhost:${port}`);
})