const express=require("express")
const app=express()
const mongoose = require('mongoose')
const router=express.Router();
const World= require("../models/world")
const {worldSchemas}=require("../schemas")
const catchAsync= require("../utils/catchAsync");
const expressError = require("../utils/expressError");
const  worlds= require("../controllers/worlds")
const {isLoggedIn,validateReview,validation,isAuthor}=require("../middleware")
const {storage}=require("../cloudinary")
const multer  = require('multer')
const upload = multer({ storage })
//middleware for the form validation
 

router.route("/").get( catchAsync(worlds.index))
 .post(isLoggedIn,upload.array("image"),validation,catchAsync(worlds.creatWorld))



//get route for the homepage
router.get("/new",isLoggedIn,worlds.renderNew)
//post route for the home page
router.route("/:id")
.get(catchAsync( worlds.renderShow))
.put(isLoggedIn,isAuthor,upload.array("image"),validation,catchAsync( worlds.update))
.delete(isLoggedIn,isAuthor,catchAsync( worlds.deleteWorld))
//get route for edit 
router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync( worlds.renderEdit))
//put router for edit

//delere route




//creation of new site of fun;



module.exports=router;