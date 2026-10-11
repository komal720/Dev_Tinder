
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/database");

const AuthRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");
const requestRouter = require("./routes/request");

const app = express();

// ================= MIDDLEWARE =================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ================= ROUTES =================

app.use("/", AuthRouter);
app.use("/", profileRouter);
app.use("/", userRouter);
app.use("/", requestRouter);

// ================= START SERVER =================

connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });
