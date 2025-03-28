    const { query } = require('express');
    const express = require('express');
    const connectDB = require("./config/database");

    const app  = express();
    const User = require("./models/user");
    const { validateSignUpData } = require("./utils/validation");
    const bcrypt = require('bcrypt');

    app.use(express.json())

    app.post("/signup", async (req, res) => {

        // Create a new instance of the User model
        try{
            // Validation of the data
            validateSignUpData(req);
            
            const  {firstName, lastName, emailId,  password} = req.body;
            // Encrypt the password

            const passwordHash = await bcrypt.hash(password, 10);
            const user = new User(
                {
                    firstName,
                    lastName,
                    emailId, 
                    password : passwordHash,
                }
            );


            await user.save();
            res.send("User Added Successfully");
        }catch(err){
            res.status(400).send("Error saving the user " + err.message)
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
    app.patch("/user/:userId",  async (req, res) => {
        const userId = req.params?.userId;
        const data = req.body;      

        try{
            const ALLOWED_UPDATES = ["photoUrl", "about","gender","age","skills"];
            const isUpdateAllowed = Object.keys(data).every(key => ALLOWED_UPDATES.includes(key));
            if(!isUpdateAllowed){
                throw new Error("Updates not allowed");
            }  
            if(data?.skills.length > 10){
                throw new Error("Skills cannot be more than 10");
            }
            const user = await User.findByIdAndUpdate({_id:userId}, data,{runValidators:true,returnDocument : true});
            res.send("User Updated Successfully");
        }catch(err){
            res.status(400).send("Update failed: " + err.message)
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

