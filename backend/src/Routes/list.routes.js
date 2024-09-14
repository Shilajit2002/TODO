const router = require('express').Router();

const auth = require('../Middleware/auth');
const { createList, getAllList, getPerList, editList, deleteList } = require('../Controller/list.controller');

// Create List API
router.post("/create-list/:id", auth, createList);
// All List API
router.get("/get-all-list/:id", auth, getAllList);
// Perticular List API
router.get("/get-per-list/:id/:listId", auth, getPerList);
// Edit List API
router.put("/edit-list/:id", auth, editList);
// Delete List API
router.delete("/delete-list/:id/:listId", auth, deleteList);

module.exports = router;