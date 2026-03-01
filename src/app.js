const express = require("express");
const app = express();

app.use("/hello",(req,res) => {
    res.send("Hello Hello From the server! 1123");
})


app.use("/test",(req,res) => {
    res.send("Hello From the server! ");
})

app.use("/",(req,res) => {
    res.send("Shabd Prakash");
})

app.listen(7777 , ()  => {
    console.log("Server is listening on port 7777 .....");
} );