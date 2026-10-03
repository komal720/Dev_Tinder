const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const userAuth = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;

        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        validateEditProfileData(req);

        const loggedinUser = req.user;

        Object.keys(req.body).forEach((key) => {
            loggedinUser[key] = req.body[key];
        });

        await loggedinUser.save();

        res.send("Profile updated successfully");

    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});



profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const user = req.user;

        console.log("oldPassword:", oldPassword);
        console.log("user password:", user.password);

        const isPasswordValid = await bcrypt.compare(
            oldPassword,
            user.password
        );

        if (!isPasswordValid) {
            throw new Error("Old password is incorrect");
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