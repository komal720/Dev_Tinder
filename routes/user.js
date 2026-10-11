
const express = require("express");

const userRouter = express.Router();

const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// ================= RECEIVED REQUESTS =================

userRouter.get(
  "/user/requests/received",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;

      const connectionRequests = await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status: "interested",
      }).populate(
        "fromUserId",
        "firstName lastName emailId age gender photoUrl about skills"
      );

      res.status(200).json({
        message: "Data fetched successfully",
        data: connectionRequests,
      });
    } catch (err) {
      res.status(400).json({
        message: "Error: " + err.message,
      });
    }
  }
);

// ================= ACCEPTED CONNECTIONS =================

userRouter.get(
  "/user/connections",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;

      const connections = await ConnectionRequest.find({
        $or: [
          {
            toUserId: loggedInUser._id,
            status: "accepted",
          },
          {
            fromUserId: loggedInUser._id,
            status: "accepted",
          },
        ],
      })
        .populate(
          "fromUserId",
          "firstName lastName emailId age gender photoUrl about skills"
        )
        .populate(
          "toUserId",
          "firstName lastName emailId age gender photoUrl about skills"
        );

      const data = connections
        .map((connection) => {
          // Skip requests if either user document is missing
          if (!connection.fromUserId || !connection.toUserId) {
            return null;
          }

          // Return the other user's details
          if (
            connection.fromUserId._id.toString() ===
            loggedInUser._id.toString()
          ) {
            return connection.toUserId;
          }

          return connection.fromUserId;
        })
        .filter(Boolean);

      res.status(200).json({
        message: "Connections fetched successfully",
        data,
      });
    } catch (err) {
      res.status(400).json({
        message: "Error fetching connections: " + err.message,
      });
    }
  }
);

// ================= FEED =================

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const users = await User.find({
      _id: { $ne: loggedInUser._id },
    }).select(
      "firstName lastName emailId age gender photoUrl about skills"
    );

    res.status(200).json({
      message: "Feed fetched successfully",
      data: users,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error fetching feed: " + err.message,
    });
  }
});

// ================= EXPORT ROUTER =================

module.exports = userRouter;
