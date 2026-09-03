const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of Data
    validateSignUpData(req);
    const {
      firstName,
      lastName,
      emailId,
      password,
      skills,
      age,
      gender,
      about,
      photoUrl,
    } = req.body;
    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      skills,
      password: passwordHash,
      age,
      gender,
      about,
      photoUrl,
    });

    const savedUser = await user.save();

    res.send({ message: "User Added Successfully", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }
    console.log(user);

    const isPasswordValid = await user.validatePassword(password);
    //  const isPasswordValid = await bcrypt.compare(password,user.password);

    if (isPasswordValid) {
      // Create a JWT Tokens

      const token = await jwt.sign({ _id: user.id }, "DEV@Tinder$798");
      // const token = await user.getJWT();
      // Add the token to cookie and send the response back to the user
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 8 * 3600000),
      });

      // res.cookie("token", token);
      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successfully");
});

module.exports = authRouter;
