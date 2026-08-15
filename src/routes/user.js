const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAVE_DATA = [
  "firstName",
  "lastName",
  "photoUrl",
  "about",
  "skills"
];

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAVE_DATA);

    res.json({
      message: "Data Fetched Successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAVE_DATA)
      .populate("toUserId", USER_SAVE_DATA);
    

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const loggedInUser = req.user;

    const allUsers = await User.find({})
      .select(USER_SAVE_DATA)
      .skip(skip)
      .limit(limit);

    const allRequests = await ConnectionRequest.find({}).select([
      "fromUserId",
      "toUserId",
    ]);

    const userRequestIds = new Set();

    allRequests.forEach((request) => {
      if (request.fromUserId.toString() === loggedInUser._id.toString()) {
        userRequestIds.add(request.toUserId.toString());
      } else if (request.toUserId.toString() === loggedInUser._id.toString()) {
        userRequestIds.add(request.fromUserId.toString());
      }
    });

    const filteredUsers = allUsers.filter((user) => {
      const userId = user._id.toString();

      return (
        userId !== loggedInUser._id.toString() && !userRequestIds.has(userId)
      );
    });

    res.send(filteredUsers);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = userRouter;
