const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
app.use(express.json());
// Post data in API

app.post("/signup", async (req, res) => {
  try {
    // Validation of Data
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
  
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User Added Successfully!");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.post("/login" , async (req,res) => {
  try {
const {emailId , password} = req.body;
 console.log(password);
const user = await User.findOne({emailId:emailId}) ;
if(!user) {
  throw new Error("Invalid credentials")
}
console.log(user);
const isPasswordValid = await bcrypt.compare(password , user.password);
if(isPasswordValid) {
  res.send("Login successful!!!")
}
else {
  throw new Error("Invalid credentials");
}
  }
  catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }


})


// Get user by email

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.findOne({ emailId: userEmail });
    res.send(user);
   
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});
// Get all user Data by Feed
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});
// Delete user By Id
app.delete("/user", async (req, res) => {
  userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    res.send("User Deleted successfully");
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});
// Update user API
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const UPDATE_ALLOWED = ["photoUrl", "gender", "age", "skills"];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      UPDATE_ALLOWED.includes(k),
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills?.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("UPDATE FAILED " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Connection established successfully...");
    app.listen(7777, () => {
      console.log("Server is listening on port 7777 .....");
    });
  })
  .catch(() => {
    console.error("Database cannot be connected....");
  });
