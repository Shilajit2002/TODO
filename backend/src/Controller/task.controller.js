// Import User Collection/Model
const User = require("../Models/user.model");
// Import List Collection/Model
const List = require("../Models/list.model");
// Import Task Collection/Model
const Task = require("../Models/task.model");

// Create Task API
const createTask = async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            // Check the user is exists or not
            let user = await User.findById({ _id: req.params.id });
            // If not exists
            if (!user) {
                // Set Not Found Status
                return res.status(404).send("User Not Found!!");
            }

            // Extract the Data
            const { title, description, list, date, subtask, done } = req.body;

            // Find that User List
            let l = await List.findOne({ user_id: req.params.id });

            // List Names
            let lIndex = await l.listArr.findIndex((l) => l.name === list);

            if (lIndex !== -1) {
                // Increase the Count
                l.listArr[lIndex].count += 1;
                // Save the Data in List Collecton
                const c = await l.save();
            }

            // Find that User Tasks
            let task = await Task.findOne({ user_id: req.params.id });

            // Store the Data
            let arr =
                [{
                    title,
                    description,
                    list,
                    date,
                    subtask,
                    done
                }]

            // If the Task is not present
            if (!task) {
                // Set the Collection Field with Data
                task = new Task({
                    user_id: req.params.id,
                    taskArr: arr
                })
            }
            // Other wise push the task
            else {
                task.taskArr.push(...arr);
            }

            // Save the Data in Task Collecton
            let createTask = await task.save();

            // Set Created Status
            return res.status(201).json(createTask);
        } else {
            // Set Internal Server Error Status
            return res.status(500).send("You can only view your own account !!");
        }
    } catch (error) {
        // Set Internal Server Error Status
        return res.status(500).send(`${error}`);
    }
}

// All Task API
const getAllTask = async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            // Check the user is exists or not
            let user = await User.findById({ _id: req.params.id });
            // If not exists
            if (!user) {
                // Set Not Found Status
                return res.status(404).send("User Not Found!!");
            }

            // Find that User Tasks
            let task = await Task.findOne({ user_id: req.params.id });

            // Set Ok Status
            return res.status(200).json(task);
        } else {
            // Set Internal Server Error Status
            return res.status(500).send("You can only view your own account !!");
        }
    } catch (error) {
        // Set Internal Server Error Status
        return res.status(500).send(`${error}`);
    }
}

// Perticular Task API
const getPerTask = async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            // Check the user is exists or not
            let user = await User.findById({ _id: req.params.id });
            // If not exists
            if (!user) {
                // Set Not Found Status
                return res.status(404).send("User Not Found!!");
            }

            // Find that User Tasks
            let task = await Task.findOne({ user_id: req.params.id });

            if (task && task.taskArr.length !== 0) {
                // Find that perticular Task index by using task id
                let perTask = await task.taskArr.findIndex((t) => t._id.toString() === req.params.taskId);

                if (perTask !== -1) {
                    // Set Ok Status
                    return res.status(200).json(task.taskArr[perTask]);
                } else {
                    // Set Not Found Status
                    return res.status(404).send("Tasks Not Found!!");
                }
            }
            // Set Ok Status
            return res.status(200).send("No Task has been created yet");
        } else {
            // Set Internal Server Error Status
            return res.status(500).send("You can only view your own account !!");
        }
    } catch (error) {
        // Set Internal Server Error Status
        return res.status(500).send(`${error}`);
    }
}

// Edit Task API
const editTask = async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            // Check the user is exists or not
            let user = await User.findById({ _id: req.params.id });
            // If not exists
            if (!user) {
                // Set Not Found Status
                return res.status(404).send("User Not Found!!");
            }

            // Find that User Tasks
            let task = await Task.findOne({ user_id: req.params.id });

            if (task && task.taskArr.length !== 0) {
                // Find that perticular Task index by using task id
                let perTask = await task.taskArr.findIndex((t) => t._id.toString() === req.body._id);

                if (perTask !== -1) {
                    // Find that User List
                    let l = await List.findOne({ user_id: req.params.id });

                    if (req.body.list !== task.taskArr[perTask].list) {
                        let prevIndex = await l.listArr.findIndex((l) => l.name === task.taskArr[perTask].list);

                        if (prevIndex !== -1) {
                            // Decrease the Count
                            l.listArr[prevIndex].count -= 1;
                            // Save the Data in List Collecton
                            const cl = await l.save();
                        }

                        let nextIndex = await l.listArr.findIndex((l) => l.name === req.body.list);

                        if (nextIndex !== -1) {
                            // Increase the Count
                            l.listArr[nextIndex].count += 1;
                            // Save the Data in List Collecton
                            const cn = await l.save();
                        }
                    }

                    // Update the Task
                    task.taskArr[perTask] = req.body;
                    // Save the Data in Task Collecton
                    const updateTask = await task.save();
                    // Set Ok Status
                    return res.status(200).json(updateTask);
                } else {
                    // Set Not Found Status
                    return res.status(404).send("Tasks Not Found!!");
                }
            }
            // Set Ok Status
            return res.status(200).send("No Task has been created yet");
        } else {
            // Set Internal Server Error Status
            return res.status(500).send("You can only view your own account !!");
        }
    } catch (error) {
        // Set Internal Server Error Status
        return res.status(500).send(`${error}`);
    }
}

// Delete Task API
const deleteTask = async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            // Check the user is exists or not
            let user = await User.findById({ _id: req.params.id });
            // If not exists
            if (!user) {
                // Set Not Found Status
                return res.status(404).send("User Not Found!!");
            }

            // Find that User Tasks
            let task = await Task.findOne({ user_id: req.params.id });

            if (task && task.taskArr.length !== 0) {
                // Find that perticular Task index by using task id
                let perTask = await task.taskArr.findIndex((t) => t._id.toString() === req.params.taskId);

                if (perTask !== -1) {
                    // Find that User List
                    let l = await List.findOne({ user_id: req.params.id });

                    // List Names
                    let lIndex = await l.listArr.findIndex((l) => l.name === task.taskArr[perTask].list);

                    if (lIndex !== -1) {
                        // Decrease the Count
                        l.listArr[lIndex].count -= 1;
                        // Save the Data in List Collecton
                        const c = await l.save();
                    }

                    // Remove the Task
                    task.taskArr.splice(perTask, 1);
                    // Save the Data in Task Collecton
                    const deleteTask = await task.save();
                    // Set Ok Status
                    return res.status(200).json(deleteTask);
                } else {
                    // Set Not Found Status
                    return res.status(404).send("Tasks Not Found!!");
                }
            }
            // Set Ok Status
            return res.status(200).send("No Task has been created yet");
        } else {
            // Set Internal Server Error Status
            return res.status(500).send("You can only view your own account !!");
        }
    } catch (error) {
        // Set Internal Server Error Status
        return res.status(500).send(`${error}`);
    }
}

// Exports the Router
module.exports = { createTask, getAllTask, getPerTask, editTask, deleteTask };