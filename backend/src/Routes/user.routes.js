const router = require('express').Router();

const auth = require('../Middleware/auth');
const { register, login, getUserDetails, editDetails } = require('../Controller/user.controller');

// SignUp API
router.post("/register", register);
// SignIn API
router.post("/login", login);
// Get Details API
router.get("/get-details/:id", auth, getUserDetails);
// Edit Details API
router.put("/edit-details/:id", auth, editDetails);

module.exports = router;