import express from 'express'
import * as dotenv from 'dotenv'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import { contactUS } from './handlers/contactUs.js'

dotenv.config()
const app = express()

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
app.get('/hackathon',(req,res)=>{
    res.render('hackathon');
})

//login page
app.get("/user",(req,res)=>{
    res.render('user')
})
app.post("/login",(req,res)=>{
    const {email,password,type} = req.body
    console.log(`mail:${email} & password:${password} & type:${type}`)
    res.render('ps')
})

//explore
app.get('/explore',(req,res)=>{
    res.render('ps')
})
app.get('/explore/solution',(req,res)=>{
    res.render('solution')
})

//post requests
app.post("/student/signup",(req,res)=>{
    const {name,collegeName,registrationNumber,stream,branch,email,password,phone,currentYear,passedOutYear} = req.body
    console.log(`name:${name} & email:${email} & password:${password} & phone:${phone}  & branch:${branch}
    & stream:${stream} & collegeName:${collegeName} & registrationNumber:${registrationNumber}`)
    
    res.render('ps')
})

app.post("/industry/signup",(req,res)=>{
  
      const {name,industryName,employeeID,role,siteLink,email,password,officialNumber,personalNumber} = req.body
    console.log(`name:${name} & email:${email} & password:${password} & phone:${officialNumber} & phone:${personalNumber}  & siteLink:${siteLink}
    & role:${role} & employeeID:${employeeID} `)
    res.render('ps')
})
app.post("/verify/signup",(req,res)=>{
  
      const {name,collegeName,designation,dept,areaOfExpertise,email,password,phone,experience} = req.body
    console.log(`name:${name} & email:${email} & password:${password}  `)
    res.render('ps')
})

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