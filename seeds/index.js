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
  for(let i=0;i<40;i++){
    const rand=Math.floor(Math.random()*1000+1)
    const world=new World({
      location: `${cities[rand].city} , ${cities[rand].state}`,
      name:`${sample(descriptors)}, ${sample(places)}`,
      owner:'675454a34891e9d042d626a5',
      price:Math.floor(Math.random()*500+1),
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      images:[
        {
          url: 'https://res.cloudinary.com/dsw8xzyyz/image/upload/v1733976141/Worlds/xp1mzjqnmizbiu2cvzyy.jpg',
          filename: 'Worlds/xp1mzjqnmizbiu2cvzyy'
        },
        {
          url: 'https://res.cloudinary.com/dsw8xzyyz/image/upload/v1733976141/Worlds/e8mubv6qglutc9k60rwd.jpg',
          filename: 'Worlds/e8mubv6qglutc9k60rwd'
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
    
  


