const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AuthRouter = express.Router();


// ================= SIGNUP =================

AuthRouter.post("/signup", async (req, res) => {
    try {
        console.log("1. Request received");
        console.log(req.body);

        const {
            firstName,
            lastName,
            emailId,
            password
        } = req.body;

        console.log("2. Before bcrypt");

        const passwordHash = await bcrypt.hash(password, 10);

        console.log("3. Bcrypt successful");

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });

        console.log("4. User object created");

        await user.save();

        console.log("5. User saved");

        res.send("User added successfully");

    } catch (err) {
        console.log("SIGNUP ERROR:", err);
        console.log(err.stack);

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

        // Store token in cookie
        res.cookie("token", token);

        res.send("Login successful");

    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});


// ================= LOGOUT =================

AuthRouter.post("/logout", (req, res) => {

    res.cookie("token", null, {
        expires: new Date(Date.now())
    });

    res.send("Logout successfully");
});


module.exports = AuthRouter;