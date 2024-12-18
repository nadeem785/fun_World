const express=require("express")
const app=express()
const mongoose = require('mongoose')
const  reviews=require("../controllers/reviews")
const router=express.Router({mergeParams:true});
const World= require("../models/world")
const {worldSchemas,reviewSchemas}=require("../schemas")
const catchAsync= require("../utils/catchAsync")
const Review=require("../models/review")
const {isLoggedIn,validateReview,isAuthor,isReviewAuthor}=require("../middleware")

//middleware for the form validateReview

 router.post("/",isLoggedIn,validateReview,reviews.createReview)
 router.delete("/:reviewid",isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview))
 module.exports=router;
