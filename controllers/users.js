
const User= require("../models/user")
module.exports.registerUSer=async(req,res)=>{
    try{
        const {username,email,password}=req.body
    const user= new User({email, username})
    const newuser= await User.register(user,password)
    req.login(newuser,err=>{
        if(err) return next(err)
            req.flash("success","yep logged in")
        res.redirect("/worlds")
    })
   
    }catch(e){
        req.flash("error",e.message)
        res.redirect("register")

    }
 }
 module.exports.loginUSer=(req,res)=>{
    console.log(res.locals.returnTo)
   req.flash("success","you loged in successfully")
   const redirectUrl=   res.locals.returnTo||"/worlds";
   delete req.session.returnTo;
   res.redirect(redirectUrl);
   
   }
module.exports.logoutUSer=(req,res,next)=>{
    req.logout(function(err){
         if(err){
            
             return next(err)
         }
         req.flash("success","Logged you out")
         res.redirect("/worlds")
     })
   
 }