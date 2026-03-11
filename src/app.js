const express = require("express");
const app = express();

const {adminAuth} = require("./middleware/auth")
const {userAuth} = require("./middleware/auth")
app.use("/admin",adminAuth)
app.use("/user",userAuth);
app.get("/user/login" , (req,res) => {
  res.send("User logged in successfully");
});

app.get("/user/data" ,userAuth, (req,res) => {
  res.send("User Data Send");
});


app.get("/admin/getAllData", (req, res, next) => {
   res.send("All Data Sent");
});

app.get("/admin/deleteUser" , (req,res,next) => {
    res.send("Deleted a User")
})


app.listen(7777, () => {
  console.log("Server is listening on port 7777 .....");
});
