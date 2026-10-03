const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name not valid!");
    }

    if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password");
    }
};

const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "age",
        "gender",
        "skills"
    ];

    const isEditAllowed = Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field)
    );

    if (!isEditAllowed) {
        throw new Error("Update not allowed");
    }

    return true;
};

module.exports = {
    validateSignUpData,
    validateEditProfileData
};