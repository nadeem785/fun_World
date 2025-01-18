const express=require("express")
const app=express()
const mongoose = require('mongoose');
const cities=require("./cities");
const {descriptors,places}=require("./seedHelpers")
const World = require("../models/world");
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fun_World');
  console.log('Connected to MongoDB');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
const sample=(array)=>array[Math.floor(Math.random()*array.length)];

const seedDb= async()=>{
  await World.deleteMany({});
  for(let i=0;i<10;i++){
    const rand=Math.floor(Math.random()*1000+1)
    const world=new World({
      location: `${cities[rand].city} , ${cities[rand].state}`,
      name:`${sample(descriptors)}, ${sample(places)}`,
      owner:'6787b228e37226e65150d09f',
      price:Math.floor(Math.random()*500+1),
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      images:[
        {
        url: 'https://res.cloudinary.com/dsw8xzyyz/image/upload/v1737133778/Worlds/dkagrzfu7arm6pede9n9.jpg',
        filename: 'Worlds/dkagrzfu7arm6pede9n9',
        
      },
      {
        url: 'https://res.cloudinary.com/dsw8xzyyz/image/upload/v1737133780/Worlds/lzaimqi6a2gv2twx3uwz.avif',
        filename: 'Worlds/lzaimqi6a2gv2twx3uwz',
       
      }
  
    
      ],
      geometry: {
        type: 'Point',
        coordinates: [ cities[rand].longitude, cities[rand].latitude ]
      }
    

      
    })
    await world.save();
  }
  }
  seedDb().then(()=>{
    mongoose.connection.close();
  })
    
  


