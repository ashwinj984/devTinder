const express = require('express');
const authRouter = express.Router();
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require('bcrypt');



authRouter.post("/signup", async (req, res) => {

    // Create a new instance of the User model
    try {
        // Validation of the data
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;
        // Encrypt the password

        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User(
            {
                firstName,
                lastName,
                emailId,
                password: passwordHash,
            }
        );


        await user.save();
        res.send("User Added Successfully");
    } catch (err) {
        res.status(400).send("Error saving the user " + err.message)
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie("token", token);
            res.send("Login Successful!!!");
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", "null", {
        expires: new Date(Date.now()),
    });
    res.send("Logout Successfull!!!")
})

module.exports = authRouter;