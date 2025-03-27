const { query } = require('express');
const express = require('express');

const app  = express();
const { adminAuth, userAuth } = require('./middlewares/auth')


app.use("/admin",adminAuth)


// this will only handle GET requests to /user
app.get("/user", userAuth, (req, res) => {
    console.log("handling the route user!!")
    res.send("Hello User")
})


app.listen(7777,() => {
    console.log('Server is running on port 7777....');
});