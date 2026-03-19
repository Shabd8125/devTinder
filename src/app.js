const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");


app.use(express.json());
app.post("/signup", async (req, res) => {
  // const userObj = {
  //   firstName: "MS",
  //   lastName: "Dhoni",
  //   emailId: "msdhoni@gmail.com",
  //   password: "Dhoni@0112358",
  // };
  const user = new User(req.body);
try {
  await user.save();
  res.send("User Added Successfully!");
}
catch (err) {
  res.status(400).send("Error saving the user:", err.message);
}

});

connectDB()
  .then(() => {
    console.log("Connection established successsfully...");

    app.listen(7777, () => {
      console.log("Server is listening on port 7777 .....");
    });
  })
  .catch(() => {
    console.error("Database cannot be connected....");
  });
