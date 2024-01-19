import express from 'express'


const app = express()
//app.use(express.static(__dirname + '/public'));
// app.use(express.static('public'));
app.use('/public', express.static(process.cwd() + '/public'));
app.set('view engine', 'ejs')
// app.use('/public', express.static(__dirname + '/public'));
app.get("/",(req,res)=>{
    res.render("index");
})

app.listen(3000,()=>{
    console.log("server listening on port 3000")
})