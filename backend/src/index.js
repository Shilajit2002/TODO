// Import dot-env file
require('dotenv').config({ path: '../.env' });
// Connect Database
require("./Config/db");

// Import express & cors
const express = require('express');
const cors = require('cors');

// Import User Routes
const userRoutes = require("./Routes/user.routes");
// Import List Routes
const listRoutes = require("./Routes/list.routes");
// Import Task Routes
const taskRoutes = require("./Routes/task.routes");

// Create App
const app = express();

// Backend Port
const port = process.env.PORT || 8000;

// Origin is Frontend Server URL
const options = { origin: `*` };
// Attaching cors with Frontend Server URL
app.use(cors(options));

// Set up express middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Server Entry Point
app.get("/", (req, res) => {
    return res.status(200).send("<h1>Welcome to ToDoMonk Server</h1>");
})

// API Entry Point
app.get("/api/v1", (req, res) => {
    return res.status(200).send("<h1>Welcome to ToDoMonk API'S</h1>");
})

// Users API
app.use("/api/v1/users", userRoutes);
// Lists API
app.use("/api/v1/lists", listRoutes);
// Tasks API
app.use("/api/v1/tasks", taskRoutes);

// Not Routing Pages
app.all("*", (req, res) => {
    return res.status(404).send("<h1>`~` Page Not Found `~`</h1>");
})

// Listening Port
app.listen(port, () => {
    console.log(`ToDoMonk Server Listening on : ${port} PORT....`);
    console.log(`Backend Server URL : ${process.env.BACKEND_SERVER}`);
})