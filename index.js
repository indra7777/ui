import express from 'express'
import morgan from 'morgan'
import multer from 'multer'
import jwt from 'jsonwebtoken'
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
  console.log(req.user)
    // res.render("dashboard",{
    //   user:req.user
    // });
    res.render('index')

})
app.get("/user",protect,(req,res)=>{
  console.log(req.user)
    res.render("dashboard",{
      user:req.user
    });
})
//hackathon page
app.get('/hackathon',protect,(req,res)=>{
    res.render('hackathon',{
      user:req.user
    });
})
app.get("/infra",protect,(req,res)=>{
  res.render("infraStructure",{
    user:req.user
  })
})

// //login page
// app.get("/user",(req,res)=>{
//     res.render('user')
// })
app.post("/login",(req,res)=>{
    res.send("please select user")
})
app.get('/home',protect,(req,res)=>{
  res.render('dashboard',{
    user:req.user
  })
})
app.post("/login/student",verifyStudent)
// app.post("/login/industry",verifyIndustry)
app.post("/login/industry",(req,res)=>{
  res.render('working')
})
// app.post("/login/team",verifyTeam)
app.post("/login/team",(req,res)=>{
  res.render('working')
})
app.get('/explore',protect,(req,res)=>{
  
    res.render('explore',{
      user:req.user
    })
})
app.get('/explore/solution',protect,(req,res)=>{
    res.render('solution',{
      user:req.user
    })
})

app.get('/personal', protect, async (req, res) => {
  try {
    const token = req.cookies.token;

  if (!token) {
    res.render('index')
    return
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET)
    console.log(user)
    const student = await Student.findById(user.id).select('-password');
    console.log(student)
    res.render('personal',{
      user:student
    })
  } catch (e) {
    console.error(e)
    res.render('user')
    return
    
  }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while retrieving the user profile' });
  }
});

app.get('/profile', protect, async (req, res) => {
  try {
    const token = req.cookies.token;

  if (!token) {
    res.render('user')
    return
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET)
    console.log(user)
    const student = await Student.findById(user.id).select('-password');
    if (!student) {
        console.error('No student found with this id');
        res.render('user');
        return;
      }
    console.log(student)
    res.render('personal',{
      user:student
    })
  } catch (e) {
    console.error(e)
    res.render('user')
    return
    
  }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while retrieving the user profile' });
  }
});

app.get('/infraseek',(req,res)=>{
  res.render('infraseek')
})

app.post('/update-profile', protect, async (req, res) => {
  try {
      const updatedUser = await Student.findOneAndUpdate(
      { _id: req.user.id },
      {
      name: req.body.name,
      email: req.body.email,
      collegeName: req.body.collegeName,
      stream: req.body.stream,
      branch: req.body.branch,
      phone: req.body.phone,
      currentYear: req.body.currentYear,
      passedOutYear: req.body.passedOutYear,
      image:req.body.avatar,
      },
      { new: true }
      );

      res.render('personal',{ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred while updating the user profile' });
  }
});


app.post("/student/signup",createStudent)

// app.post("/industry/signup",createIndustry)
app.post("/industry/signup",(req,res)=>{
  res.render('working')
})

// app.post("/verify/signup",createTeam)
app.post("/verify/signup",(req,res)=>{
  res.render('working')
})


//contact
app.post("/contact", contactUS)

//blogs

app.get("/blogs",protect , async function(req,res){
    try {
        const posts = await Post.find({});
        res.render("showBlogs", {
            posts: posts,
            startingContent:"Welcome to Uncalled Innovators",
            user:req.user,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while retrieving posts");
    }
   

});


app.get("/blogs/compose",protect,function(req,res){
  res.render("compose",{
    user:req.user
  });
});

app.post("/blogs/compose",protect,upload.single('image'),async function(req,res){
   try {
    if (!req.file) {
      res.status(400).send("No file uploaded");
      return;
    }
    const post = new Post({
      title: req.body.postTitle,
      content: req.body.postBody,
      image:req.file ? req.file.filename : null,
      userId:req.user.id
    });
    await post.save();
    console.log(post)
    res.redirect("/blogs");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while saving the post");
  }
});
app.get('/temp',(req,res)=>{
  res.render('tempBlog')
})

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

app.get('/logout', protect,(req, res) => {
  // clear the token cookie
  
  res.clearCookie('token');
  // redirect the user to the login page
  res.redirect('/');
});

//payment hanlde

// app.post('/create-checkout-session', async (req, res) => {
//   const { product } = req.body;

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     line_items: [
//       {
//         price_data: {
//           currency: 'usd',
//           product_data: {
//             name: product.name,
//             images: [product.image],
//           },
//           unit_amount: product.price,
//         },
//         quantity: 1,
//       },
//     ],
//     mode: 'payment',
//     success_url: 'https://example.com/success',
//     cancel_url: 'https://example.com/cancel',
//   });

//   res.json({ id: session.id });
// });

mongoose.connect(process.env.MONGO_URL)
.then( ()=>{
    console.log('app connected to database  succesfully')
app.listen(process.env.PORT,()=>{
    console.log(`server listening on port ${process.env.PORT}`)
})
}).catch((err)=>{
        console.log(err);
    })