import express from 'express'
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
dotenv.config()
const app = express()
app.use(cookieParser())
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



mongoose.connect(process.env.MONGO_URL)
.then( ()=>{
    console.log('app connected to database  succesfully')
app.listen(process.env.PORT,()=>{
    console.log(`server listening on port ${process.env.PORT}`)
})
}).catch((err)=>{
        console.log(err);
    })