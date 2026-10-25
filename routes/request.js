
const express = require("express");
const requestRouter = express.Router();

const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// TEST ROUTE
requestRouter.get("/request/test", (req, res) => {
  res.send("Request router is working!");
});

// SEND CONNECTION REQUEST
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const { status, toUserId } = req.params;
      const fromUserId = req.user._id;

      if (!["interested", "ignore"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(404).json({ message: "User not found" });
      }

      if (fromUserId.toString() === toUserId) {
        return res.status(400).json({
          message: "You cannot send a request to yourself",
        });
      }

      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        return res.status(400).json({
          message: "Connection request already exists",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await connectionRequest.save();

      return res.status(201).json({
        message: "Connection request sent successfully",
        data: connectionRequest,
      });
    } catch (err) {
      console.error("SEND REQUEST ERROR:", err);
      return res.status(400).json({ message: err.message });
    }
  }
);

// REVIEW CONNECTION REQUEST

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;

      if (!["accepted", "rejected"].includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }

      console.log("Request ID received:", requestId);
      console.log("Logged-in user ID:", String(loggedInUser._id));

      const connectionRequest =
        await ConnectionRequest.findById(requestId);

      console.log("Found request:", connectionRequest);

      if (!connectionRequest) {
        return res.status(404).json({
          message: "Connection request not found",
        });
      }

      console.log(
        "Request sender ID:",
        String(connectionRequest.fromUserId)
      );

      console.log(
        "Request receiver ID:",
        String(connectionRequest.toUserId)
      );

      console.log(
        "Is receiver?",
        String(connectionRequest.toUserId) ===
          String(loggedInUser._id)
      );

      if (
        String(connectionRequest.toUserId) !==
        String(loggedInUser._id)
      ) {
        return res.status(403).json({
          message: "You are not allowed to review this request",
        });
      }

      if (connectionRequest.status !== "interested") {
        return res.status(400).json({
          message: "This request has already been reviewed",
        });
      }

      connectionRequest.status = status;
      await connectionRequest.save();

      return res.status(200).json({
        message: `Connection request ${status} successfully`,
        data: connectionRequest,
      });
    } catch (err) {
      console.error("REVIEW REQUEST ERROR:", err);

      return res.status(500).json({
        message: err.message,
      });
    }
  }
);

module.exports = requestRouter;
