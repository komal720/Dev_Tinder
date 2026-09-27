const token ="xyz";
const isAdminAuthorized=token ==="xyz";
if(!isAdminAuthorized){
    res.sendStatus(401).send("unAuthorized");

}else{
    next();
}
 
 
 
 
 const userAuth=(req,res,next)=>{
    
console.log("admin auth is getting ");
const token ="xyz";
const isAdminAuthorized=token ==="xyz";
if(!isAdminAuthorized){
    res.sendStatus(401).send("unAuthorized");

}else{
    next();
}
};


module.exports= {
    adminAuth,
    userAuth,
};