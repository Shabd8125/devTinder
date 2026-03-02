const express = require("express");
const app = express();

app.get("/user/:userId/:name/:password" , (req,res)=> {
     console.log( req.params);
res.send({firstName:"Shabd" , middleName:"Prakash" , lastName:"Tripathi"})
});

app.post("/user" , (req,res)=> {
    console.log("Save data to database");
    res.send("Data successfully saved to database");
});
app.delete("/user" , (req,res)=> {
    res.send("Deleted successfully");
});
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