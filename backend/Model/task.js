// Import Mongoose
const mongoose = require('mongoose');
// Import Validator
const validator = require('validator');

// Create Task Schema
const taskSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    taskArr: [
        {
            title: {
                type: String
            },
            description: {
                type: String
            },
            list: {
                type: String
            },
            date: {
                type: String
            },
            subtask: [
                {
                    type: String
                }
            ],
            done:{
                type:Boolean,
                default:false
            }
        }
    ]
})

// Create Task Collection
const Task = mongoose.model("tasks", taskSchema);

// Exports Task Module
module.exports = Task;