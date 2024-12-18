const World= require("../models/world")
const Review= require("../models/review")

module.exports.createReview=async (req,res)=>{
    const id= req.params.id;
    console.log(id)
    const world= await World.findById(id);
    const review= new Review(req.body.review)
    review.author= req.user._id;
    world.reviews.push(review);
    await world.save();
    await review.save();
    req.flash("success","Successfully review added!!")
    res.redirect(`/worlds/${id}`)
    




 }

 module.exports.deleteReview=async(req,res)=>{
    const id=req.params.id;
    const reviewid=req.params.reviewid;
    const world= await World.findByIdAndUpdate(id, {$pull:{reviews:reviewid}})
    req.flash("success","Successfully review deleted!!")
    res.redirect(`/worlds/${id}`)

 }