const express = require('express');

const app = express();



const {adminAuth,userAuth}=require("./middlewares/auth");


app.use("/admin",adminAuth);
app.use("/user",userAuth);


app.get("/user",(req,res)=>{
    res.send("user data");

});

app.get("/admin/getalldata",(req,res)=>{
    res.send("all data");
    
});

app.get("/admin/deleteuser",(req,res)=>{
    res.send("delete data");
    
});
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


app.listen(3000,()=>{
    console.log("server is succesfully listening ")
}); 

