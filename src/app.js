const express = require("express");
const app = express();
// Handle Auth Middleware for all GET,POST,......requests 
app.use("/admin" , (req,res,next) => {
    console.log("Admin auth is getting checked !!");
    const token = "xyz";
    const isAdminAuthorized = token === "xyzvbf";
    if(!isAdminAuthorized) {
       res.status(401).send("Unauthorized request")
    } else {
        next();
    }
})

app.get("/admin/getAllData", (req, res, next) => {
   res.send("All Data Sent");
});

app.get("/admin/deleteUser" , (req,res,next) => {
    res.send("Deleted a User")
})


app.listen(7777, () => {
  console.log("Server is listening on port 7777 .....");
});
