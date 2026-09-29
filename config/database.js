const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://komalpandey0318_db_user:komal121@cluster0.jutkxdv.mongodb.net/devTinder"
    );
};

module.exports = connectDB;