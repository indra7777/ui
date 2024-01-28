import express from 'express'
import morgan from 'morgan'
import multer from 'multer'
import path from 'path'
import * as dotenv from 'dotenv'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import { contactUS } from './handlers/contactUs.js'
import { comparePasswords,hashPassword,protect,createJWT } from './handlers/auth.js'
import { Student } from './models/student.js'
import { createStudent } from './handlers/studentSignup.js'
import { verifyStudent } from './handlers/verifyStudent.js'
import { createIndustry } from './handlers/createIndustry.js'
import { verifyIndustry } from './handlers/verifyIndustry.js'
import { createTeam } from './handlers/createTeam.js'
import { verifyTeam } from './handlers/verifyTeam.js'
import { Post } from './models/post.js'
dotenv.config()
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
const app = express()
app.use(cookieParser())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use('/public', express.static(process.cwd() + '/public'));
app.set('view engine', 'ejs')

//get request

// home page
app.get("/",(req,res)=>{
    res.render("index");
})
//hackathon page
app.get('/hackathon',protect,(req,res)=>{
    res.render('hackathon');
})

//login page
app.get("/user",(req,res)=>{
    res.render('user')
})
app.post("/",(req,res)=>{
    res.send("you are not a user")
})
app.post("/login/student",verifyStudent)
app.post("/login/industry",verifyIndustry)
app.post("/login/team",verifyTeam)
app.get('/explore',protect,(req,res)=>{
    res.render('ps')
})
app.get('/explore/solution',protect,(req,res)=>{
    res.render('solution')
})



app.post("/student/signup",createStudent)

app.post("/industry/signup",createIndustry)

app.post("/verify/signup",createTeam)

//contact
app.post("/contact", contactUS)

//blogs

app.get("/blogs", async function(req,res){
    try {
        const posts = await Post.find({});
        res.render("blogs", {
            posts: posts,
            startingContent:"Welcome to Uncalled Innovators",
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while retrieving posts");
    }

});


app.get("/blogs/compose",function(req,res){
  res.render("compose");
});

app.post("/blogs/compose",upload.single('image'),async function(req,res){
   try {
    if (!req.file) {
      res.status(400).send("No file uploaded");
      return;
    }
    const post = new Post({
      title: req.body.postTitle,
      content: req.body.postBody,
      image:req.file ? req.file.filename : null,
    });

    await post.save();
    console.log(post)
    res.redirect("/blogs");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while saving the post");
  }
});

app.get("/blogs/posts/:id", async function(req,res){
   const reqPostID = req.params.id;
  try {
    const post = await Post.findOne({ _id: reqPostID });
     res.render("post", {
 
      post:post
 
    });
 
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while retrieving the post");
  }
});

mongoose.connect(process.env.MONGO_URL)
.then( ()=>{
    console.log('app connected to database  succesfully')
app.listen(process.env.PORT,()=>{
    console.log(`server listening on port ${process.env.PORT}`)
})
}).catch((err)=>{
        console.log(err);
    })