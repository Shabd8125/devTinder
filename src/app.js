const express = require("express");
const app = express();





app.get("/getUserData", (req,res) => {

try{
 throw new Error("cddfjghrn");
  res.send("User Data Sent");
}
catch(err) {
  res.status(500).send("some Error contact support team");
}

});

app.use("/" , (err,req,res,next) => {
  if(err) {
    res.status(500).send("something went wrong");
  }
})

app.listen(7777, () => {
  console.log("Server is listening on port 7777 .....");
});
