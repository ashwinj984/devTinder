const { query } = require('express');
const express = require('express');
const connectDB = require("./config/database");

const app  = express();
const User = require("./models/user");


app.use(express.json())

app.post("/signup", async (req, res) => {
    
    const user = new User(req.body);
    try{
        await user.save();
        res.send("User Added Successfully");
    }catch(err){
        res.status(400).send("Error saving the user")
    }
});


connectDB()
    .then(() => {
        console.log("Database connected")
        app.listen(7777,() => {
            console.log('Server is running on port 7777....');
        });
    }).catch(err => {
        console.error("Database connot be connected!!");
    })

