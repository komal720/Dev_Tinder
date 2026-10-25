
const express = require("express");
const router = express.Router();

const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// ================= ALL / SENT REQUESTS =================
router.get("/user/requests", userAuth, async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({
      fromUserId: req.user._id,
      status: "interested",
    }).select("fromUserId toUserId status");

    res.status(200).json({
      message: "Requests fetched successfully",
      data: requests,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching requests",
      error: err.message,
    });
  }
});

// ================= SENT REQUESTS =================
router.get("/user/requests/sent", userAuth, async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({
      fromUserId: req.user._id,
      status: "interested",
    }).select("fromUserId toUserId status");

    res.status(200).json({
      message: "Sent requests fetched successfully",
      data: requests,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= RECEIVED REQUESTS =================
router.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({
      toUserId: req.user._id,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName emailId age gender photoUrl about skills"
    );

    res.status(200).json({
      message: "Received requests fetched successfully",
      data: requests,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching received requests: " + err.message,
    });
  }
});

// ================= ACCEPTED CONNECTIONS =================
router.get("/user/connections", userAuth, async (req, res) => {
  try {
    const id = req.user._id;

    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: id, status: "accepted" },
        { fromUserId: id, status: "accepted" },
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
        if (!connection.fromUserId || !connection.toUserId) {
          return null;
        }

        return connection.fromUserId._id.toString() === id.toString()
          ? connection.toUserId
          : connection.fromUserId;
      })
      .filter(Boolean);

    res.status(200).json({
      message: "Connections fetched successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching connections: " + err.message,
    });
  }
});

// ================= FEED =================
router.get("/feed", userAuth, async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
    }).select(
      "firstName lastName emailId age gender photoUrl about skills"
    );

    res.status(200).json({
      message: "Feed fetched successfully",
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching feed: " + err.message,
    });
  }
});

module.exports = router;
