import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject:String,
    message: String
});

const Contact = mongoose.model('Contact',contactSchema);

export const contactUS = (req,res)=>{
    if(!req.body.name | !req.body.email | !req.body.subject | !req.body.message){
        console.log(req.body)
        res.send('invalid input')
        return
    }

    const contact = new Contact({
        name:req.body.name,
        email:req.body.email,
        subject:req.body.subject,
        message:req.body.message
    })

    contact.save()
        .then(() => {
            console.log(contact);
            res.render('index');
        })
        .catch((err) => {
            console.log(err);
        })
}
