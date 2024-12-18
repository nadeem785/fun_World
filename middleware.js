const {worldSchemas,reviewSchemas}=require("./schemas")
const expressError = require("./utils/expressError");
const World= require("./models/world")
const Review = require("./models/review")

 module.exports.isLoggedIn=(req,res,next)=>{
  if(!req.isAuthenticated()){

    req.session.returnTo=req.originalUrl
    console.log(req.originalUrl)
    req.flash("error","You must be logged in to create a new world")
    return res.redirect("/login")
}
else{
    next()
}
 }
 module.exports.storeReturnTo=(req,res,next)=>{
  if(req.session.returnTo){
    res.locals.returnTo=req.session.returnTo
  }
  next()
 }
 module.exports.validation=(req,res,next)=>{
  const {error}= worldSchemas.validate(req.body)
  
  if(error){
      const val= error.details.map(er=>er.message).join(',')
      throw new expressError(val,404)
  }
  else{
      next()
  }
}
// isAutor middleware
module.exports.isAuthor=async(req,res,next)=>{
  const id= req.params.id
  const world= await World.findById(id)
  if(!world.owner.equals(req.user._id)){
      req.flash("error","You cannot edit a non-existent world!!")
       return res.redirect(`/worlds/${id}`);
  }
  next()
}
module.exports.isReviewAuthor=async(req,res,next)=>{
  const {id,reviewid}= req.params
  const review= await Review.findById(reviewid)
  if(!review.author.equals(req.user._id)){
      req.flash("error","You cannot edit a non-existent world!!")
      return res.redirect(`/worlds/${id}`);
  }
  next()
}
module.exports.validateReview=(req,res,next)=>{
  const {error}= reviewSchemas.validate(req.body)
  
  if(error){
      const val= error.details.map(er=>er.message).join(',')
      throw new expressError(val,404)
  }
  else{
      next();
  }
}