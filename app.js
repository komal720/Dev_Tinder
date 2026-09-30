const express = require("express");

const connectDB=require ("./config/database");
const app = express();

const User = require("./models/user");

 const { validateSignUpData } = require("./utils/validation");
 const bcrypt=require("bcrypt");
app.use(express.json());

app.post("/signup", async (req,res)=>{
    try{

    //validates of data
    validateSignUpData(req);
    const { firstName,
        lastName,
        emailId,password}=req.body;

        //encrypt the pw
        const passwordHash = await bcrypt.hash(password, 10);
console.log(passwordHash);


//console.log(req.body);

//creating new instance of user model
    const user = new User({
        firstName,
        lastName,
        emailId,
        password:passwordHash,
    }
    );


     await user.save();
    res.send("user added");

   }catch(err){
    res.status(400).send("ERROR:"+err.message);
    
   }

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
        // if(user.length===0){
        //     res.status(404).send("User not found");

        // }else{
        // res.send(user);
        // }

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
// app.get("/getuserdata",(req,res)=>{
//     throw new Error("aswqzx");
//     res.send("user data");

// });

// app.use("/",(err,req,res,next)=>{
//     if(err){
//         res.status(500).send("something went wrong");

//     }
// });



// const {adminAuth,userAuth}=require("./middlewares/auth");


// app.use("/admin",adminAuth);
// app.use("/user",userAuth);


// app.get("/user",(req,res)=>{
//     res.send("user data");

// });

// app.get("/admin/getalldata",(req,res)=>{
//     res.send("all data");
    
// });

// app.get("/admin/deleteuser",(req,res)=>{
//     res.send("delete data");
    
// });
//GET /user

// app.use("/",(req,res)=>{
//   //  res.send("handling");
// next();

// });

// app.use("/user",(req,res,next)=>{
//     console.log("handling the route");
//     next();

// },[
// (req,res,next)=>{
//     console.log("handling the route 1");
//     next();
    
// },
// (req,res,next)=>{
//     console.log("handling the route 1");
//    res.send("1st response");
    
// }],
// )

// app.get("/user", (req, res) => {
//     res.send({
//         first: "komal",
//         last: "pandey"
//     });
// });

// app.post("/user",(req,res)=>{
//     res.send("data successfully");


// });
// app.delete("/user",(req,res)=>{
//     res.send("delete data");

// });

// app.patch("/user1", (req, res) => {
//     res.send("test");
// });
// app.use("/hello",(req,res) =>{
//     res.send("hi  from the server");

// });



connectDB()
    .then(() => {
        console.log("database connection");
        app.listen(3000,()=>{
    console.log("server is succesfully listening ")
}); 

    })
    .catch(err => {
        
        console.error("database not connection");
        console.error(err.message);
    });

