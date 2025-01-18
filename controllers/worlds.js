const World= require("../models/world")
const {cloudinary}= require("../cloudinary")

const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;









module.exports.index=async(req,res,next)=>{
    const worlds= await World.find({});

    res.render("world/home",{worlds});

}
module.exports.renderNew=(req,res)=>{
   
    res.render("world/new");
}
module.exports.creatWorld=async (req,res,next)=>{
    const geoData = await maptilerClient.geocoding.forward(req.body.world.location, { limit: 1 });
    const world = new World(req.body.world);
    world.geometry = geoData.features[0].geometry;
    
   console.log(world)
    world.images=req.files.map(f=>({url:f.path,filename:f.filename}))
    world.owner= req.user._id
    console.log(world);
    const newWorld= new World(world);
    await newWorld.save();
   req.flash("success","You have created a new Fun world!!")
    res.redirect(`/worlds/${newWorld._id}`);
   

}
module.exports.renderEdit=async (req,res,next)=>{
    const id=req.params.id;
  
    const world=await World.findById(id)
    if(!world){
        req.flash("error","You cannot edit a non-existent world!!")
         return res.redirect("/worlds");
    }
   
    

    res.render("world/edit",{world});
    

}
module.exports.update=async (req,res,next)=>{
    const id=req.params.id;
    const wor =await World.findById(id)
   
    if(!wor.owner.equals(req.user._id)){
        req.flash("error","You cannot edit a world that is not yours!!")
        return res.redirect(`/worlds/${id}`)
    }
     const world= await World.findByIdAndUpdate(id, {...req.body.world})
     const img= req.files.map(f=>({url:f.path,filename:f.filename}))
     world.images.push(...img)
     if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
             await cloudinary.uploader.destroy(filename)
        }
         await world.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
     }
     console.log(world)
    await world.save();
    res.redirect(`/worlds/${id}`)

}
module.exports.deleteWorld=async (req,res,next)=>{
    const id= req.params.id;
    const wor =await World.findById(id)
       if(!wor.owner.equals(req.user._id)){
           req.flash("error","You cannot edit a world that is not yours!!")
           return res.redirect(`/worlds/${id}`)
       }
    const world= await World.findByIdAndDelete(id);
    req.flash("success","You deleted a campground ")
    res.redirect("/worlds");
   
   }
module.exports.renderShow=async (req,res,next)=>{
    const id=req.params.id;
const world=await World.findById(id).populate({
    path:"reviews",
    populate:{
        path:"author"
    }

}).populate("owner");
console.log(world)
if(!world){
    req.flash("error","You cannot edit a non-existent world!!")
     return res.redirect("/worlds");
}
console.log(world)
res.render("world/show",{world})


}