const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());


const  AuthRouter = require("./routes/auth");
const profileRouter= require("./routes/profile");
const requestRouter= require("./routes/request");


app.use("/", AuthRouter);
app.use("/", profileRouter);



app.use("/", requestRouter);

//get user by email
// app.get("/user", async (req, res) => {
//     const userEmail = req.query.emailId;


//     try {
//         const user = await User.findOne({ emailId: userEmail });


//         if (!user) {
//             res.status(404).send("user not found");

//         }
//         else {
//             res.send(user);

//         }

//     }
//     catch (err) {
//         res.status(400).send("something wrong");
//     }
//     //   User.find({emailId:userEmail})

// });
//feed api- get /feed- get all the users from the database
// app.get("/feed", async (req, res) => {
//     try {
//         const user = await User.find({});
//         res.send(user);

//     } catch (err) {
//         res.status(400).send("something wrong");

//     }

// });
// delete a user from the database
// app.delete("/user", async (req, res) => {
//     const userId = req.body.userId;

//     try {
//         const user = await User.findByIdAndDelete(userId);

//         if (!user) {
//             return res.status(404).send("user not found");
//         }

//         res.send("user deleted");
//     }
//     catch (err) {
//         res.status(400).send("something wrong");
//     }
// });

// update data of user

// Update user using emailId

// app.patch("/user", async (req, res) => {
//     const { userId, ...data } = req.body;

//     try {
//         const ALLOWED_UPDATES = [
//             "gender",
//             "photoUrl",
//             "skills"
//         ];

//         const isUpdateAllowed = Object.keys(data).every((key) =>
//             ALLOWED_UPDATES.includes(key)
//         );

//         if (!isUpdateAllowed) {
//             return res.status(400).send("Update not allowed");
//         }

//         const user = await User.findByIdAndUpdate(
//             userId,
//             data,
//             {
//                 new: true,
//                 runValidators: true
//             }
//         );

//         if (!user) {
//             return res.status(404).send("User not found");
//         }


//         res.send(user);

//     } catch (err) {
//         res.status(400).send("Something went wrong: " + err.message);
//     }
// });

connectDB()
    .then(() => {
        console.log("database connection");

        app.listen(3000, () => {
            console.log("server is succesfully listening");
        });
    })
