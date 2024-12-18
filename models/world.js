const express=require("express")
const app=express()
const mongoose = require('mongoose');
const { descriptors } = require("../seeds/seedHelpers");
const schema=mongoose.Schema;
const Review= require("./review");
const { string } = require("joi");
 const imageSchema= new schema({
     url:String,
        filename:String,
       
 })
 imageSchema.virtual('thumbnail').get(function (){
    return this.url.replace('/upload/','/upload/w_200/')
 })
 const opts={toJSON:{virtuals:true}}
const worldSchema=  new schema({
    name: String,
    location:String,
    description:String ,
    price:Number,
    images:[  imageSchema ],
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    reviews:[
        {
            type:schema.Types.ObjectId,
            ref:"Review"
        }
    ]
    ,
    owner:{
        type:schema.Types.ObjectId,
        ref:'User'
        }

},opts)
worldSchema.virtual('properties.popUpMarkup').get(function (){
  return `<a href="/worlds/${this._id}">${this.name}</a>
  <p>${this.description}</p>`
})
worldSchema.post("findOneAndDelete",  async function(doc){
 if(doc){
    await Review.deleteMany({
        _id:{$in:doc.reviews}
     })
 }
})

module.exports=mongoose.model("World",worldSchema);