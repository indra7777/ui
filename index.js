import express from 'express'
import * as dotenv from 'dotenv'
dotenv.config()
const app = express()
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
    res.render('authentication')
})

//post requests

//contact
app.post("/contact", (req,res)=>{
    //store  contact information in db
    //code
    res.render("index")
})




app.listen(process.env.PORT,()=>{
    console.log("server listening on port 3000")
})