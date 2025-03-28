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

    // GET user by email
    app.get("/user", async (req, res) => {
        // console.log(req.body.emailId);
        const userEmail = req.body.emailId;

        try{
            const user = await User.find({emailId : userEmail});
            if(user.length === 0){
                res.status(404).send("User not found");
            }else{
                res.send(user);
            }
            
        }catch(err){
            res.status(400).send("Something went wrong")
        }
    })

    // Feed API - GET /feed - get all the users from the database
    app.get("/feed", async (req, res) => {
        try{
            const users = await User.find({});
            res.send(users);
        }catch(err){
            res.status(400).send("Something went wrong")
        }
    });

    app.delete("/user", async (req, res) => {
        const userId = req.body.userId;

        try{
            const user = await User.findByIdAndDelete(userId);
            res.send("User Deleted Successfully");
        }catch(err){
            res.status(400).send("Something went wrong")
        }
        
    })

    // Update data by the user
    app.patch("/user",  async (req, res) => {
        const userId = req.body.userId;
        const data = req.body;
        try{
            await User.findByIdAndUpdate({_id:userId}, data);
            res.send("User Updated Successfully");
        }catch(err){
            res.status(400).send("Something went wrong")
        }
    })


    connectDB()
        .then(() => {
            console.log("Database connected")
            app.listen(7777,() => {
                console.log('Server is running on port 7777....');
            });
        }).catch(err => {
            console.error("Database connot be connected!!");
        })

