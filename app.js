 if(process.env.NODE_ENV!=="production"){
  require("dotenv").config()
 }

const express=require("express")
const app=express()
const mongoose = require('mongoose')
const ejs=require("ejs");
const methodOverride=require("method-override")
const ejsmate=require("ejs-mate")
const expressError=require("./utils/expressError")
const morgan=require("morgan");
app.use(morgan("tiny"))
const User= require("./models/user")
const worldRoute= require("./routes/worlds")
const reviewRoute=require("./routes/reviews")
const session= require("express-session")
const MongoStore = require('connect-mongo');
const passport= require("passport")
const LocalStrategy = require("passport-local");
const userRoute=require("./routes/users")
const helmet=require("helmet")
const flash= require("connect-flash")
app.use(flash())


const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
    // "https://api.tiles.mapbox.com/",
    // "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.mapbox.com/",
    // "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const connectSrcUrls = [
    // "https://api.mapbox.com/",
    // "https://a.tiles.mapbox.com/",
    // "https://b.tiles.mapbox.com/",
    // "https://events.mapbox.com/",
    "https://api.maptiler.com/", // add this
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: [],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
              "https://res.cloudinary.com/dsw8xzyyz/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
              "https://images.unsplash.com/",
              "https://api.maptiler.com/",
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
      },
  })
);





















const mongoSanitize=require("express-mongo-sanitize")
app.engine("ejs",ejsmate)
const path=require("path");
const { rmSync } = require("fs");

app.set("view engine","ejs")
app.set("views", path.join(__dirname,"views"))

app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));


const dbUrl="mongodb://127.0.0.1:27017/fun_World"
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
      secret: 'thisshouldbeabettersecret!'
  }
});
store.on("error",function(e){
  console.log(e);
})
const sessionConfig={
  store,
  name: 'session',
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      // secure: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
  }
}
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize())
app.use(session(sessionConfig))







//mongose connections
main().catch(err => console.log(err));

async function main() {
  //mongodb://127.0.0.1:27017/fun_World
  await mongoose.connect(dbUrl);
console.log("connected to database")
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
 
app.use(passport.initialize())

app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next)=>{
  console.log(req.query)
 res.locals.currentUser= req.user
  res.locals.success=req.flash("success");
  console.log( res.locals.success)
  res.locals.error=req.flash("error");
  next();
})

app.get("/",(req,res)=>{
    res.render("intro")
})

//world routes
app.use("/worlds",worldRoute)
app.use("/worlds/:id/reviews",reviewRoute)
app.use("/",userRoute)
//error handling route
app.all("*",(req,res,next)=>{
  next( new expressError("No page is found",404))

})
app.use((err,req,res,next)=>{
  if(err){
   const {message="something went wrong ",code=500}=err;
   res.status(code).render("error",{err})
 
  }
})



  app.listen(3000,()=>{
    console.log("listing in 3000");
  })