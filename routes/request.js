const express = require('express');

const  requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
requestRouter.post("/sendConnection", userAuth, async (req, res) => {

    const user = req.user;
    //sending  a connection request 
    console.log("snding a connection");

    res.send("connection requst");

})
module.exports= requestRouter;
