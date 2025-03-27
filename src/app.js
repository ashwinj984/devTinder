const { query } = require('express');
const express = require('express');

const app  = express();

// this will only handle GET requests to /user
app.get("/getUserData", (req, res) => {
  try{
    console.log("handling the route user!!")

    throw new Error("This is a forced error")
    res.send("Hello User")
  }catch(err){
    res.status(500).send("There was a server side error")
  }
})


app.use("/", (err, req, res, next) => {
    if(err){
        res.status(500).send("There was a server side error")
    }

})


app.listen(7777,() => {
    console.log('Server is running on port 7777....');
});