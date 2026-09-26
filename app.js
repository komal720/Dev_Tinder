const express = require('express');

const app = express();

app.get("/user", (req, res) => {
    res.send({
        first: "komal",
        last: "pandey"
    });
});

app.post("/user",(req,res)=>{
    res.send("data successfully");


});
app.delete("/user",(req,res)=>{
    res.send("delete data");

});

app.patch("/user1", (req, res) => {
    res.send("test");
});
app.use("/hello",(req,res) =>{
    res.send("hi  from the server");

});


app.listen(3000,()=>{
    console.log("server is succesfully listening ")
}); 

