// Import Mongoose
const mongoose = require('mongoose');

// Create List Schema
const listSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    listArr: [
        {
            name: {
                type: String
            },
            color: {
                type: String
            },
            count: {
                type: Number,
                default: 0
            }
        }
    ]
})

// Create List Collection
const List = mongoose.model("lists", listSchema);

// Exports List Module
module.exports = List;