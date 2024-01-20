import express from 'express'
import * as dotenv from 'dotenv'
dotenv.config()

const app = express()
//app.use(express.static(__dirname + '/public'));
// app.use(express.static('public'));
app.use('/public', express.static(process.cwd() + '/public'));
app.set('view engine', 'ejs')
// app.use('/public', express.static(__dirname + '/public'));
app.get("/",(req,res)=>{
    res.render("index");
})
app.get('/hackathon',(req,res)=>{
    res.render('hackathon');
})

app.get("/user",(req,res)=>{
    res.render('authentication')
})
app.listen(process.env.PORT,()=>{
    console.log("server listening on port 3000")
})