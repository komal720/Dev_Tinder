const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).send("Please login");
        }

        const decodedObj = jwt.verify(
            token,
            "DEV#@!infw%$87"
        );

        const user = await User.findById(decodedObj._id);

        if (!user) {
            return res.status(401).send("User not found");
        }

        req.user = user;

        next();

    } catch (err) {
        console.log("AUTH ERROR:", err.message);
        res.status(401).send("ERROR: " + err.message);
    }
};

module.exports = userAuth;