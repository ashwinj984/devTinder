const { query } = require('express');
const express = require('express');
const connectDB = require("./config/database");
const app = express();
const cookieParser = require('cookie-parser');

// parse data to json then only we will be able to read it
app.use(express.json());
//cookie parser
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);


connectDB()
    .then(() => {
        console.log("Database connected")
        app.listen(7777, () => {
            console.log('Server is running on port 7777....');
        });
    }).catch(err => {
        console.error("Database connot be connected!!");
    })

