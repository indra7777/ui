import mongoose from 'mongoose'

const problem = new mongoose.Schema({
    title: {
         type: String,
          required: true
    },
    description:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    },
    image:{
        data:String,
        required:true
    },
    industrialist:{
        type:mongoose.Types.ObjectId, 
        required:true
    }
})

export const Probelm = mongoose.model('Problem',problem)