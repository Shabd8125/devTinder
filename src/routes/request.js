const express = require("express")
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
 requestRouter.post("/sentConnectionRequest", userAuth, async (req, res) => {
  console.log("Sending a connection request");
  const user = req.user;
  res.send(user.firstName + " sent the connect request!");
});

module.exports = requestRouter;