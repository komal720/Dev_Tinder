const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");

const userAuth = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");




// ================= VIEW PROFILE =================
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;

        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});


// ================= EDIT PROFILE =================

// ================= EDIT PROFILE =================
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        // Validate the requested fields
        validateEditProfileData(req);

        const loggedinUser = req.user;

        // Update only the fields sent in the request
        Object.keys(req.body).forEach((key) => {
            loggedinUser[key] = req.body[key];
        });

        await loggedinUser.save();

        res.json({
            message: "Profile updated successfully",
            data: loggedinUser
        });

    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
});



// ================= CHANGE PASSWORD =================
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).send("Old password and new password are required");
        }

        if (newPassword.length < 8) {
            return res.status(400).send("New password must be at least 8 characters");
        }

        const user = req.user;

        const isPasswordValid = await bcrypt.compare(
            oldPassword,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(400).send("Old password is incorrect");
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);

        user.password = passwordHash;

        await user.save();

        res.send("Password updated successfully");

    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});


module.exports = profileRouter;