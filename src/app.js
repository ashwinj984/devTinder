const { query } = require('express');
const express = require('express');
const connectDB = require("./config/database");

const app  = express();
const User = require("./models/user");


app.post("/signup", async (req, res) => {
    const userObj = {
        firstName : "Aalya",
        lastName : 'Jain',
        emailId : "aalya@jain.com",
        password:"aalya@jain123",
        age:22,
        gender:"female",
    }
    // Creating a new instance of the User Model
    const user = new User(userObj);
    try{
        await user.save();
        res.send("User Added Successfully");
    }catch(err){
        res.status(400).send("Error saving the user")
    }


connectDB()
    .then(() => {
        console.log("Database connected")
        app.listen(7777,() => {
            console.log('Server is running on port 7777....');
        });
    }).catch(err => {
        console.error("Database connot be connected!!");
    })

