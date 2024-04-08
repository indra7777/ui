import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema({
    day :{
        type : Number
    },
    createdDate : {
        type : Date,
        default : Date.now
    },
    company: {  
        type : String, 
        required : 'Please enter the name of the company'
    },
    description : {
        type : String
    },
    link : {
        type : String
    }
});

export const Internship = mongoose.model('Internship', internshipSchema);

// function to add a new internship
function createInternship(req, res){
    const internship = new Internship(req.body);
    internship.save((err, internship) => {
        if(err){
            res.send(err);
        }
        res.json(internship);
    });
}

// get all internships
function getAllInternships(req,res){
    Internship.find({}, (err, internships) => {
        if(err){
            res.status(400).send("Error: " + err);
        } else {
            res.json(internships);
        }
    });
}