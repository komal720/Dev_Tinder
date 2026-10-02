const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AuthRouter = express.Router();


// ================= SIGNUP =================
AuthRouter.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req);

        const {
            firstName,
            lastName,
            emailId,
            password
        } = req.body;

        // Encrypt password
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });

        await user.save();

        res.send("user added");

    } catch (err) {

        if (err.code === 11000) {
            return res.status(400).send("Email already exists");
        }

        res.status(400).send("ERROR: " + err.message);
    }
});


// ================= LOGIN =================
AuthRouter.post("/login", async (req, res) => {
    try {

        const { emailId, password } = req.body;

        // Find user
        const user = await User.findOne({ emailId });

        if (!user) {
            throw new Error("EmailId not present");
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        // Create JWT
        const token = jwt.sign(
            { _id: user._id },
            "DEV#@!infw%$87"
        );

        console.log(token);

        // Store token in cookie
        res.cookie("token", token);

        res.send("Login successful");

    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});


module.exports = AuthRouter;