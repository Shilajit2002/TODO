// Import Express
const express = require('express');
// Import Router
const router = new express.Router();
// Import JWT
const jwt = require('jsonwebtoken');
// Import bcryptjs
const bcryptjs = require('bcryptjs');

// Import User Collection/Model
const User = require("../Model/user");

// Import Authentication
const auth = require('../Middleware/auth');

// Hash Password Func
const hashPassword = async (ps) => {
    // Generating the Salt
    const secPass = await bcryptjs.genSalt(Number(process.env.SALT));
    // Hashing the Password
    return await bcryptjs.hash(ps, secPass);
}

// SignUp API
router.post("/register", async (req, res) => {
    try {
        // Extract the Data
        const { fullname, email, password } = req.body;

        // Check the email is already exists or not
        let user = await User.findOne({ email });

        // If exists the email
        if (user) {
            // Set Conflict Status
            return res.status(409).send("User Already Registered");
        }
        // Call hashPassword Func
        const newPass = await hashPassword(password);

        // Set the Collection Field with Data
        user = new User({
            fullname,
            email,
            password: newPass
        })

        // Save the Data in User Collecton
        const createUser = await user.save();

        //  Set Created Status
        return res.status(201).send(createUser);
    } catch (error) {
        //  Set Bad Request Status
        res.status(400).send(`${error}`);
    }
})

// Create Token Func
const createToken = (u) => {
    return jwt.sign({ id: u._id }, process.env.SECRET_KEY,
        {
            // Token expires by 365 days or 1 after year
            expiresIn: "365d"
        }
    );
}

// SignIn API
router.post("/login", async (req, res) => {
    try {
        // Extract the Data
        const { email, password } = req.body;

        // Check the Email is exists or not
        let logUser = await User.findOne({ email });

        // If not exists
        if (!logUser) {
            //  Set Not Found Status
            return res.status(404).send("User Not Registered")
        }

        /* If Exists */

        // Compare the password with database password
        const comparePassword = await bcryptjs.compare(password, logUser.password);
        // If the Password is wrong
        if (!comparePassword) {
            //  Set Not Found Status
            return res.status(404).send("Password is Incorrect")
        }
        // If the Password is Correct
        else {
            // Create a token by secret key
            const token = createToken(logUser);

            // Set Ok Status
            return res.status(200).json({ token, userid: logUser._id })
        }
    } catch (error) {
        //  Set Bad Request Status
        res.status(400).send(`${error}`);
    }
})

// Get Details API
router.get("/get-details/:id", auth, async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            // Check the user is exists or not
            let user = await User.findById({ _id: req.params.id });
            // If not exists
            if (!user) {
                // Set Not Found Status
                return res.status(404).send("User Not Found!!");
            } else {
                // Convert to Object
                user = user.toObject();
                // Delete the Password
                delete user.password;

                //  Set Ok Status
                return res.status(200).json(user);
            }
        } else {
            // Set Internal Server Error Status
            return res.status(500).send("You can only view your own account !!");
        }
    } catch (error) {
        // Set Internal Server Error Status
        return res.status(500).send(`${error}`);
    }
})

// Edit Details API
router.put("/edit-details/:id", auth, async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            // Check the user is exists or not if exists then update this
            let user = await User.findByIdAndUpdate({ _id: req.params.id }, { fullname: req.body.fullname, pic: req.body.pic }, { new: true });
            // If not exists
            if (!user) {
                // Set Not Found Status
                return res.status(404).send("User Not Found!!");
            } else {
                //  Set Ok Status
                return res.status(200).json(user);
            }
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