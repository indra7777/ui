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
    res.render('authentication')
})

//post requests

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