const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
    },

    emailId: {
        type: String,
        required: true,
        unique: true,
        isLowercase: "true",
        unique: "true",
        validator(value) {
            if (!validator.isEmail(value)) {
                throw new Error("invalid")
            }
        }


    },

    password: {
        type: String,
        required: true,
    },

    age: {
        type: Number,
        min: 18,
    },

    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("Gender data is not valid");
            }
        },
    },

    photoUrl: {
        type: String,
    },

    about: {
        type: String,
        default: "this is default photo",
    },

    skills: {
        type: [String],
    }
}, {
    timestamps: true,

});


userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await Jwt.sign({ _id: user._id }, "DEV#@!infw%$87", {
        expiresIn: "7d",

    });
    return token;
}


userSchema.methods.validatePassword = async function (password) {
     const user = this;
     const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash
        
     ); 
    return isPasswordValid;
 };
module.exports = mongoose.model("User", userSchema);