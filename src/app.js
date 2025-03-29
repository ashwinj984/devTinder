const { query } = require('express');
const express = require('express');
const connectDB = require("./config/database");

const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// parse data to json then only we will be able to read it
app.use(express.json());

//cookie parser
app.use(cookieParser());

app.post("/signup", async (req, res) => {

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

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (isPasswordValid) {

            // Create a JWT token
            const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$8546");
            // Add the token to cookie and send the response back to the user
            res.cookie("token", token);
            res.send("Login Successful!!!");
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})

app.get("/profile", async (req, res) => {
    try {
        const cookie = req.cookies;
        const { token } = cookie;
        if (!token) {
            throw new Error("Invalid Token");
        }

        //validate my token
        const decodedValue = await jwt.verify(token, "DEV@Tinder$8546");

        const { _id } = decodedValue;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User does not exist")
        }
        res.send("Data fetched successfully");
    } catch (err) {
        res.status(400).send("Error : " + err.message)
    }
})

// GET user by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        const user = await User.find({ emailId: userEmail });
        if (user.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(user);
        }

    } catch (err) {
        res.status(400).send("Something went wrong")
    }
})

// Feed API - GET /feed - get all the users from the database
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        res.status(400).send("Something went wrong")
    }
});

app.delete("/user", async (req, res) => {
    const userId = req.body.userId;

    try {
        const user = await User.findByIdAndDelete(userId);
        res.send("User Deleted Successfully");
    } catch (err) {
        res.status(400).send("Something went wrong")
    }

})

// Update data by the user
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every(key => ALLOWED_UPDATES.includes(key));
        if (!isUpdateAllowed) {
            throw new Error("Updates not allowed");
        }
        if (data?.skills.length > 10) {
            throw new Error("Skills cannot be more than 10");
        }
        const user = await User.findByIdAndUpdate({ _id: userId }, data, { runValidators: true, returnDocument: true });
        res.send("User Updated Successfully");
    } catch (err) {
        res.status(400).send("Update failed: " + err.message)
    }
})


connectDB()
    .then(() => {
        console.log("Database connected")
        app.listen(7777, () => {
            console.log('Server is running on port 7777....');
        });
    }).catch(err => {
        console.error("Database connot be connected!!");
    })

