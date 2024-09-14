// Import Mongoose
const mongoose = require('mongoose');

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    dbName: "todo"
}).then(() => {
    console.log("ToDoMonk Database Connected");
}).catch((err) => {
    console.log("Error connecting to database : " + err);
})