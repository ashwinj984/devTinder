const { query } = require('express');
const express = require('express');
const connectDB = require("./config/database");

const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth')

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
            const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$8546", { expiresIn: "1d" });
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

app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);

    } catch (err) {
        res.status(400).send("Error : " + err.message)
    }
})

app.post("/sendConnectionRequest", userAuth, async (req, res) => {

    const user = req.user;
    // Sending a connection request

    console.log("Sending a connection request");
    res.send(user.firstName + " Send the connection request");

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

