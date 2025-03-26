const express = require('express');

const app  = express();

app.use("/test",(req, res) => {
    res.send("Hello from the server side");
});


app.use("/hello",(req, res) => {
    res.send("Hello from the Hello side");
});

app.use("/",(req, res) => {
    res.send("Hello from the server side");
});


app.listen(7777,() => {
    console.log('Server is running on port 7777....');
});