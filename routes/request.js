const express = require("express");

const requestRouter = express.Router();

const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");


// ================= REVIEW CONNECTION REQUEST =================

requestRouter.post(
    "/request/send/:status/:toUserId",
    userAuth,
    async (req, res) => {
        try {
            const { status, toUserId } = req.params;

            const fromUserId = req.user._id;

            console.log("FROM:", fromUserId);
            console.log("TO:", toUserId);
            console.log("STATUS:", status);

            const allowedStatus = ["interested", "ignored"];

            if (!allowedStatus.includes(status)) {
                return res.status(400).json({
                    message: "Invalid status"
                });
            }

            const existingRequest =
                await ConnectionRequest.findOne({
                    $or: [
                        {
                            fromUserId,
                            toUserId
                        },
                        {
                            fromUserId: toUserId,
                            toUserId: fromUserId
                        }
                    ]
                });

            if (existingRequest) {
                return res.status(400).json({
                    message: "Connection request already exists"
                });
            }

            const connectionRequest =
                new ConnectionRequest({
                    fromUserId,
                    toUserId,
                    status
                });

            await connectionRequest.save();

            res.json({
                message: "Connection request sent successfully",
                data: connectionRequest
            });

        } catch (err) {
            res.status(400).json({
                message: err.message
            });
        }
    }
);


// IMPORTANT
module.exports = requestRouter;