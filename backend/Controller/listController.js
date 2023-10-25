// Import Express
const express = require('express');
// Import Router
const router = new express.Router();

// Import User Collection/Model
const User = require("../Model/user");
// Import List Collection/Model
const List = require("../Model/list");
// Import Task Collection/Model
const Task = require("../Model/task");

// Import Authentication
const auth = require('../Middleware/auth');

// Create Task API
router.post("/create-list/:id", auth, async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            // Check the user is exists or not
            let user = await User.findById({ _id: req.params.id });
            // If not exists
            if (!user) {
                // Set Not Found Status
                return res.status(404).send("User Not Found!!");
            }

            // Find that User List
            let list = await List.findOne({ user_id: req.params.id });

            // If the List is not present
            if (!list) {
                // Set the Collection Field with Data
                list = new List({
                    user_id: req.params.id,
                    listArr: [req.body]
                })
            }
            // Other wise push the list
            else {
                list.listArr.push(req.body);
            }

            // Save the Data in List Collecton
            const createList = await list.save();

            // Set Created Status
            return res.status(201).json(createList);
        } else {
            // Set Internal Server Error Status
            return res.status(500).send("You can only view your own account !!");
        }
    } catch (error) {
        // Set Internal Server Error Status
        return res.status(500).send(`${error}`);
    }
})

// All List API
router.get("/get-all-list/:id", auth, async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            // Check the user is exists or not
            let user = await User.findById({ _id: req.params.id });
            // If not exists
            if (!user) {
                // Set Not Found Status
                return res.status(404).send("User Not Found!!");
            }

            // Find that User Lists
            let list = await List.findOne({ user_id: req.params.id });

            // Set Ok Status
            return res.status(200).json(list);
        } else {
            // Set Internal Server Error Status
            return res.status(500).send("You can only view your own account !!");
        }
    } catch (error) {
        // Set Internal Server Error Status
        return res.status(500).send(`${error}`);
    }
})

// Perticular List API
router.get("/get-per-list/:id/:listId", auth, async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            // Check the user is exists or not
            let user = await User.findById({ _id: req.params.id });
            // If not exists
            if (!user) {
                // Set Not Found Status
                return res.status(404).send("User Not Found!!");
            }

            // Find that User List
            let list = await List.findOne({ user_id: req.params.id });

            if (list && list.listArr.length !== 0) {
                // Find that perticular List index by using list id
                let perList = await list.listArr.findIndex((l) => l._id.toString() === req.params.listId);

                if (perList !== -1) {
                    // Set Ok Status
                    return res.status(200).json(list.listArr[perList]);
                } else {
                    // Set Not Found Status
                    return res.status(404).send("List Not Found!!");
                }
            }
            // Set Ok Status
            return res.status(200).send("No List has been created yet");
        } else {
            // Set Internal Server Error Status
            return res.status(500).send("You can only view your own account !!");
        }
    } catch (error) {
        // Set Internal Server Error Status
        return res.status(500).send(`${error}`);
    }
})

// Edit List API
router.put("/edit-list/:id", auth, async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            // Check the user is exists or not
            let user = await User.findById({ _id: req.params.id });
            // If not exists
            if (!user) {
                // Set Not Found Status
                return res.status(404).send("User Not Found!!");
            }

            // Find that User List
            let list = await List.findOne({ user_id: req.params.id });

            if (list && list.listArr.length !== 0) {
                // Find that perticular List index by using list id
                let perList = await list.listArr.findIndex((l) => l._id.toString() === req.body._id);

                if (perList !== -1) {
                    // Find All Task
                    let tasks = await Task.findOne({ user_id: req.params.id });
                    // If Task Present
                    if (tasks && tasks.taskArr.length !== 0) {
                        // Iterate All the Task
                        tasks.taskArr.forEach(t => {
                            // Check which Task contain that list name which will be modified later
                            if (t.list === list.listArr[perList].name) {
                                t.list = req.body.name;
                            }
                        });
                        const updateTask = await tasks.save();
                    }

                    // Update the List
                    list.listArr[perList] = req.body;
                    // Save the Data in List Collecton
                    const updateList = await list.save();

                    // Set Ok Status
                    return res.status(200).json(updateList);
                } else {
                    // Set Not Found Status
                    return res.status(404).send("List Not Found!!");
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
})

// Delete List API
router.delete("/delete-list/:id/:listId", auth, async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            // Check the user is exists or not
            let user = await User.findById({ _id: req.params.id });
            // If not exists
            if (!user) {
                // Set Not Found Status
                return res.status(404).send("User Not Found!!");
            }

            // Find that User List
            let list = await List.findOne({ user_id: req.params.id });

            if (list && list.listArr.length !== 0) {
                // Find that perticular List index by using task id
                let perList = await list.listArr.findIndex((t) => t._id.toString() === req.params.listId);

                if (perList !== -1) {
                    // Remove the List
                    list.listArr.splice(perList, 1);
                    // Save the Data in List Collecton
                    const deleteList = await list.save();
                    // Set Ok Status
                    return res.status(200).json(deleteList);
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
})

// Exports the Router
module.exports = router;