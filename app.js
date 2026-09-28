const express = require("express");


const connectDB=require ("./config/database");
const app = express();

const User = require("./models/user");
 

app.use(express.json());

app.post("/signup", async (req,res)=>{
console.log(req.body);


    const user = new User(res.body);
    

   try{
     await user.save();
    res.send("user added");

   }catch(err){
    res.status(400).send("error the user"+err.message);
    
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

