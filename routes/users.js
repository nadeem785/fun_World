const express=require("express")
const app=express()
const mongoose = require('mongoose')
const router=express.Router();
const World= require("../models/world")
const User=require("../models/user")
const catchAsync= require("../utils/catchAsync");
const expressError = require("../utils/expressError");
const {storeReturnTo}=require("../middleware")
const passport=require("passport")
const users=require("../controllers/users")

router.route("/register")
.get((req,res)=>{
    res.render("user/new")
})
.post(catchAsync(users.registerUSer ))
 

 router.route("/login").get((req,res)=>{
    res.render("user/login")
 }).post(storeReturnTo,passport.authenticate('local',{failureFlash:true, failureRedirect:"/login"}), users.loginUSer)


router.get("/logout", users.logoutUSer)

module.exports=router