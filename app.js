const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(cookieParser());


app.post("/signup", async (req, res) => {
    try {
        // Validate signup data
        validateSignUpData(req);

        const {
            firstName,
            lastName,
            emailId,
            password
        } = req.body;

        // Encrypt password
        const passwordHash = await bcrypt.hash(password, 10);

        console.log(passwordHash);

        // Create user
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });

        await user.save();

        res.send("user added");

    } catch (err) {

        // Duplicate email
        if (err.code === 11000) {
            return res.status(400).send("Email already exists");
        }

        res.status(400).send("ERROR: " + err.message);
    }
});



app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId });

        if (!user) {
            throw new Error("EmailId not present");
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        const token = jwt.sign(
            { _id: user._id },
            "DEV#@!infw%$87"
        );

        console.log(token);

        res.cookie("token", token);
        res.send("Login successful");

    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});


app.get ("/profile",async (req,res)=>{
    const cookies=req.cookies;

    const {token}=cookies;

    //validate my token

   
    const  decodedMessage = await jwt.verify(token,"DEV#@!infw%$87");
    
 

    const{_id}=decodedMessage;
    console.log("logged in user"+_id);

    const user = await User.findById(_id);

    res.send(user);



    

    // console.log(cookies);
    // res.send("Reading cookie")

});












//get user by email
app.get("/user",async (req,res)=>{
    const userEmail = req.query.emailId;


    try{
        const user= await User.findOne({emailId:userEmail});


        if(!user){
            res.status(404).send("user not found");

        }
        else{
            res.send(user);

        }
      
    }
    catch (err){
        res.status(400).send("something wrong");
    }
 //   User.find({emailId:userEmail})

});
//feed api- get /feed- get all the users from the database
app.get("/feed",async(req,res)=>{
    try{
        const user =await User.find({});
        res.send(user);

    }catch(err){
        res.status(400).send("something wrong");

    }

});
// delete a user from the database
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;

    try {
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).send("user not found");
        }

        res.send("user deleted");
    }
    catch (err) {
        res.status(400).send("something wrong");
    }
});

// update data of user

// Update user using emailId

app.patch("/user", async (req, res) => {
    const { userId, ...data } = req.body;

    try {
        const ALLOWED_UPDATES = [
            "gender",
            "photoUrl",
            "skills"
        ];

        const isUpdateAllowed = Object.keys(data).every((key) =>
            ALLOWED_UPDATES.includes(key)
        );

        if (!isUpdateAllowed) {
            return res.status(400).send("Update not allowed");
        }

        const user = await User.findByIdAndUpdate(
            userId,
            data,
            {
                new: true,
                runValidators: true
            }
        );

        if (!user) {
            return res.status(404).send("User not found");
        }

        
        res.send(user);

    } catch (err) {
        res.status(400).send("Something went wrong: " + err.message);
    }
});

connectDB()
    .then(() => {
        console.log("database connection");

        app.listen(3000, () => {
            console.log("server is succesfully listening");
        });
    })
