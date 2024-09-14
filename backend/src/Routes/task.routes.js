const router = require('express').Router();

const auth = require('../Middleware/auth');
const { createTask, getAllTask, getPerTask, editTask, deleteTask } = require('../Controller/task.controller');

// Create Task API
router.post("/create-task/:id", auth, createTask)
// All Task API
router.get("/get-all-task/:id", auth, getAllTask)
// Perticular Task API
router.get("/get-per-task/:id/:taskId", auth, getPerTask)
// Edit Task API
router.put("/edit-task/:id", auth, editTask)
// Delete Task API
router.delete("/delete-task/:id/:taskId", auth, deleteTask)

module.exports = router;