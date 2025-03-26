const express = require('express');

const app  = express();


// this will only handle GET requests to /user
app.get("/user", (req, res) => {
     res.send({firstName : "Ashwin", lastName : "Jain"});
})

app.post("/user", (req, res) => {
    console.log("Save data to the database")
    res.send("User data saved successfully");
})



// this will match all the HTTP method API calls to /test
app.use("/test",(req, res) => {
    res.send("Hello from the test side");
});


app.listen(7777,() => {
    console.log('Server is running on port 7777....');
});