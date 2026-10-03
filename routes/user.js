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

            const connectionRequests =
                await ConnectionRequest.find({
                    toUserId: loggedInUser._id,
                    status: "interested"
                }).populate(
                    "fromUserId",
                    "firstName lastName emailId age gender"
                );

            res.json({
                message: "Data fetched successfully",
                data: connectionRequests
            });

        } catch (err) {
            res.status(400).send(
                "Error: " + err.message
            );
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

            const connections =
                await ConnectionRequest.find({
                    $or: [
                        {
                            toUserId: loggedInUser._id,
                            status: "accepted"
                        },
                        {
                            fromUserId: loggedInUser._id,
                            status: "accepted"
                        }
                    ]
                });

            res.json({
                message: "Connections fetched successfully",
                data: connections
            });

        } catch (err) {
            res.status(400).send({
                message: err.message
            });
        }
    }
);


// ================= FEED =================

userRouter.get(
    "/feed",
    userAuth,
    async (req, res) => {
        try {
            const loggedInUser = req.user;

            // Pagination
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const skip = (page - 1) * limit;


            // Find all connection requests
            const connectionRequests =
                await ConnectionRequest.find({
                    $or: [
                        {
                            fromUserId: loggedInUser._id
                        },
                        {
                            toUserId: loggedInUser._id
                        }
                    ]
                }).select("fromUserId toUserId");


            // Users to hide from feed
            const hideUserFromFeed = new Set();

            connectionRequests.forEach((req) => {
                hideUserFromFeed.add(
                    req.fromUserId.toString()
                );

                hideUserFromFeed.add(
                    req.toUserId.toString()
                );
            });


            // Get feed users
            const users = await User.find({
                $and: [
                    {
                        _id: {
                            $nin: Array.from(hideUserFromFeed)
                        }
                    },
                    {
                        _id: {
                            $ne: loggedInUser._id
                        }
                    }
                ]
            })
            .select("firstName lastName emailId age gender")
            .skip(skip)
            .limit(limit);


            res.send(users);

        } catch (err) {
            res.status(400).json({
                message: err.message
            });
        }
    }
);


module.exports = userRouter;
