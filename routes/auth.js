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

    const { firstName, lastName, emailId, password } = req.body;

    const existingUser = await User.findOne({ emailId });

    if (existingUser) {
      return res.status(400).send("Email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();

    // Create JWT — same as login
    const token = jwt.sign(
      { _id: user._id },
      "DEV#@!infw%$87",
      { expiresIn: "8h" }
    );

    // Set token cookie — same as login
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 8 * 60 * 60 * 1000,
    });

    // Remove password before returning user
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    // Return user data like login
    return res.status(201).json(userWithoutPassword);

  } catch (err) {
    console.log("SIGNUP ERROR:", err);

    if (err.code === 11000) {
      return res.status(400).send("Email already exists");
    }

    return res.status(400).send("ERROR: " + err.message);
  }

});


// ================= LOGIN =================

AuthRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        if (!emailId || !password) {
            return res.status(400).send(
                "Email and password are required"
            );
        }

        const user = await User.findOne({ emailId });

        if (!user) {
            return res.status(400).send("EmailId not present");
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(400).send("Invalid password");
        }

        // Create JWT
        const token = jwt.sign(
            { _id: user._id },
            "DEV#@!infw%$87"
        );

        // Store token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        // Remove password before sending user to frontend
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        // Send user data to frontend
        res.send(userWithoutPassword);

    } catch (err) {
        console.log("LOGIN ERROR:", err);
        res.status(500).send("Something went wrong");
    }
});

// ================= LOGOUT =================

AuthRouter.post("/logout", (req, res) => {
    res.cookie("token", null, {
        httpOnly: true,
        expires: new Date(0),
    });

    res.send("Logout successfully");
});

module.exports = AuthRouter;
