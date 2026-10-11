const validator = require("validator");

// Validate signup data
const validateSignUpData = (req) => {
    const { firstName, emailId, password } = req.body;

    if (!firstName || !emailId || !password) {
        throw new Error("All required fields must be filled");
    }

    if (!validator.isEmail(emailId)) {
        throw new Error("Invalid email address");
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password");
    }
};

// Validate profile edit data
const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "age",
        "gender",
        "skills",
        "photoUrl",
        "about"
    ];

    const isEditAllowed = Object.keys(req.body).every(
        (field) => allowedEditFields.includes(field)
    );

    if (!isEditAllowed) {
        throw new Error("Update not allowed");
    }

    if (Object.keys(req.body).length === 0) {
        throw new Error("Please provide at least one field to update");
    }
};

module.exports = {
    validateSignUpData,
    validateEditProfileData
};

